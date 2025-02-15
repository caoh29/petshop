import InputOTP from '@/app/components/InputOTP';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/app/components/ui/card';

export default function OTPPage() {
  return (
    <Card className='bg-primary text-white'>
      <CardHeader className='space-y-2'>
        <CardTitle className='text-3xl font-bold'>One Time Password</CardTitle>
        <CardDescription>Enter the code sent to your email</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <InputOTP />
      </CardContent>
    </Card>
  );
}
