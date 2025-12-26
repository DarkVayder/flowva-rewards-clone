import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const ref = params.get('ref');
        navigate(ref ? `/rewards?ref=${ref}` : '/rewards', {
          replace: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Loader />;
}
