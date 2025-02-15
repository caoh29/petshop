interface Props {
  otp: number;
  otpExpiry: Date;
}

export default function EmailOTPTemplate({ otp, otpExpiry }: Readonly<Props>) {
  const currentDate = new Date();
  const differenceInMinutes = Math.floor(
    (otpExpiry.getTime() - currentDate.getTime()) / 60000,
  );

  return (
    <div className='font-sans max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
          Verify Your Email Address
        </h1>

        <p className='text-base text-gray-600 mb-4'>
          Thank you for choosing Pet Shop! Please use the verification code
          below to complete your email verification. This code will expire in{' '}
          {differenceInMinutes} minutes.
        </p>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-4 my-6 text-center'>
          <p className='text-sm text-gray-600 mb-2'>
            Your verification code is:
          </p>
          <p className='text-3xl font-mono font-bold text-blue-700 tracking-wider m-0'>
            {String(otp).padStart(6, '0')}
          </p>
        </div>

        <p className='text-sm text-gray-600 mb-4'>
          If you did not request this code, please ignore this email or contact
          our support team if you have concerns about your account security.
        </p>

        <div className='bg-gray-50 border border-gray-200 rounded-md p-4 my-4'>
          <p className='text-sm text-gray-600 m-0'>
            <span className='font-semibold'>Security Tip:</span> We will never
            ask for your password or verification code through email, phone, or
            text message.
          </p>
        </div>

        <div className='text-center mt-8 text-gray-500 text-sm'>
          <pre className='font-mono text-xs'>
            {`
   /\\___/\\
  ( o   o )
  (  =^=  )
   (     )
    |___| 
            `}
          </pre>
          <p className='mb-1'>Pet Shop</p>
          <p className='mb-1'>123 Pet Street, Furry Town, ON M8W1G5</p>
          <p>support@petshop.com | (437) 663-9348</p>
        </div>
      </div>
    </div>
  );
}
