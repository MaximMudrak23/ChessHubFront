import s from './styles.module.scss'
import Button from '@/components/UI/Button'
import Lottie from 'lottie-react'
import EmailLottie from './JSON/Email.json'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { getRegisterStatus, resendRegisterEmail } from '@/api/authApi';

type Props = {
    email: string;
    onChangeEmail: () => void;
}

export default function SignUpWaitingEmail({ email, onChangeEmail }: Props) {
    const navigate = useNavigate();
    const setAuth = useUserStore(s => s.setAuth);
    
    const [isSending, setIsSending] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(60);

    useEffect(() => {
        const timer = setInterval(async () => {
            try {
                const data = await getRegisterStatus(email);

                if (!data.verified) return;

                setAuth(data.user, data.token);
                localStorage.setItem('token', data.token);

                navigate('/main');
            } catch (error) {
                console.log(error);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [email, navigate, setAuth]);

    useEffect(() => {
        if (resendSeconds <= 0) return;

        const timer = setInterval(() => {
            setResendSeconds(x => x - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendSeconds]);

    async function handleResend() {
        if (isSending || resendSeconds > 0) return;

        try {
            setIsSending(true);
            await resendRegisterEmail(email);
            setResendSeconds(60);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to resend email');
        } finally {
            setIsSending(false);
        }
    }

    function openEmail() {
        window.open('https://mail.google.com', '_blank');
    }

    return (
        <motion.div
            key='signup-waiting-email'
            className={s.sign_up_waiting_email}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Lottie
                className={s.email_lottie}
                animationData={EmailLottie}
                loop={true}
            />

            <p>Check your email</p>
            <p>We sent a verification link to {email}</p>
            <p>It may take up to 1-2 minutes. Check your Spam folder too.</p>
            
            <Button
                text={
                    isSending
                        ? 'Sending...'
                        : resendSeconds > 0
                            ? `Send Again (${resendSeconds}s)`
                            : 'Send Again'
                }
                active={!isSending && resendSeconds <= 0}
                variant='welcome'
                animation={['mini-jump', 'white-hover']}
                styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                onClick={handleResend}
            />
            <Button
                text='Use another email'
                variant='welcome'
                animation={['mini-jump', 'white-hover']}
                styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                onClick={onChangeEmail}
            />
            <Button
                text='Open Gmail'
                variant='welcome'
                animation={['mini-jump', 'white-hover']}
                styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                onClick={openEmail}
            />
        </motion.div>
    )
}