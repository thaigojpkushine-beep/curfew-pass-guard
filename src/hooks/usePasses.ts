import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Pass, PassFormData } from '@/types/Pass';

export const usePasses = () => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPasses();
    } else {
      setPasses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPasses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check if user is admin by querying user_roles
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      let query = supabase.from('passes').select('*');
      
      // If admin, get all passes; if user, get only their passes
      if (roleData?.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database data to match frontend Pass interface
      const transformedPasses: Pass[] = (data || []).map(pass => ({
        id: pass.id,
        fullName: pass.full_name,
        idNumber: pass.id_number,
        reason: pass.reason,
        destination: pass.destination,
        startTime: pass.start_time,
        endTime: pass.end_time,
        status: pass.status as 'pending' | 'approved' | 'denied' | 'expired',
        qrCode: pass.qr_code || undefined,
        createdAt: new Date(pass.created_at),
        approvedAt: pass.approved_at ? new Date(pass.approved_at) : undefined
      }));
      
      setPasses(transformedPasses);
    } catch (error) {
      console.error('Error fetching passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPass = async (formData: PassFormData): Promise<Pass | null> => {
    if (!user) return null;

    try {
      const passData = {
        user_id: user.id,
        full_name: formData.fullName,
        id_number: formData.idNumber,
        reason: formData.reason,
        destination: formData.destination,
        start_time: formData.startTime,
        end_time: formData.endTime,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('passes')
        .insert([passData])
        .select()
        .single();

      if (error) throw error;

      const newPass: Pass = {
        id: data.id,
        fullName: data.full_name,
        idNumber: data.id_number,
        reason: data.reason,
        destination: data.destination,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as 'pending' | 'approved' | 'denied' | 'expired',
        qrCode: data.qr_code || undefined,
        createdAt: new Date(data.created_at),
        approvedAt: data.approved_at ? new Date(data.approved_at) : undefined
      };

      setPasses(prev => [newPass, ...prev]);
      return newPass;
    } catch (error) {
      console.error('Error creating pass:', error);
      return null;
    }
  };

  const updatePass = async (passId: string, updates: Partial<Pass>) => {
    try {
      const dbUpdates: any = { ...updates };
      
      // Transform frontend fields to database fields
      if (updates.startTime) dbUpdates.start_time = updates.startTime;
      if (updates.endTime) dbUpdates.end_time = updates.endTime;
      if (updates.qrCode) dbUpdates.qr_code = updates.qrCode;
      if (updates.approvedAt) dbUpdates.approved_at = updates.approvedAt;
      
      // Remove frontend-only fields
      delete dbUpdates.startTime;
      delete dbUpdates.endTime;
      delete dbUpdates.qrCode;
      delete dbUpdates.createdAt;
      delete dbUpdates.approvedAt;

      const { error } = await supabase
        .from('passes')
        .update(dbUpdates)
        .eq('id', passId);

      if (error) throw error;

      setPasses(prev => prev.map(p => 
        p.id === passId ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Error updating pass:', error);
    }
  };

  return {
    passes,
    loading,
    createPass,
    updatePass,
    refetch: fetchPasses
  };
};