import ChangePasswordForm from '@/app/components/ChangePasswordForm';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/app/components/ui/card';

export default function ResetPasswordPage() {
  return (
    <Card className='bg-primary text-white'>
      <CardHeader className='space-y-2'>
        <CardTitle className='text-3xl font-bold'>Reset Password</CardTitle>
        <CardDescription>
          Enter the new password and confirm it.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <ChangePasswordForm userId={null} variant />
      </CardContent>
    </Card>
  );
}
