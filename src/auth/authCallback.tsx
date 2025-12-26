import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const ref = params.get('ref');
        navigate(ref ? `/rewards?ref=${ref}` : '/rewards', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, []);

  return <Loader />;
}