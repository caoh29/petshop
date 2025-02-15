interface Props {
  orderId: string;
}

const THANKS = "Thank you for choosing Pet Shop for your pet's needs!";

export default function EmailOrderTemplate({ orderId }: Readonly<Props>) {
  return (
    <div className='font-sans max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
          Thank You for Your Order!
        </h1>

        <p className='text-base text-gray-600 mb-4'>
          We are thrilled to confirm your order at Pet Shop! Your furry friend
          is going to love their new goodies.
        </p>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-4 my-6 text-center'>
          <p className='text-lg font-semibold text-blue-700 m-0'>
            Order ID: {orderId}
          </p>
        </div>

        <p className='text-base text-gray-600 mb-4'>
          We are preparing your order with care and will notify you once it is
          on its way. If you have any questions, please do not hesitate to
          contact our customer support.
        </p>

        <p className='text-base text-gray-600 mb-4'>{THANKS}</p>

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
