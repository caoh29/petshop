import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

export default function AboutUsPage() {
  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Hero Section */}
      <section className='bg-secondary text-white py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>About PetShop</h1>
          <p className='text-xl md:text-2xl'>
            Your one-stop shop for all things pets
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-16 bg-accent'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold mb-6'>Our Story</h2>
              <p className='text-lg mb-4'>
                Founded in 2010, PetShop started as a small local pet supply
                store with a big dream: to provide the best products and care
                for all types of pets. Over the years, we've grown into a
                leading online destination for pet owners, but our commitment to
                quality and animal welfare remains at the heart of everything we
                do.
              </p>
              <p className='text-lg'>
                From our humble beginnings to our current status as a trusted
                name in pet care, we've always put pets first. Our team of
                animal lovers and experts work tirelessly to bring you the best
                products, advice, and service.
              </p>
            </div>
            <div className='relative h-96 rounded-lg overflow-hidden'>
              <Image
                src='/doggies.jpg'
                alt='PetParadise store'
                fill
                className='object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className='bg-primary text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-6'>Our Mission</h2>
          <p className='text-xl max-w-3xl mx-auto'>
            At PetShop, our mission is to enhance the lives of pets and their
            owners by providing top-quality products, expert advice, and
            unwavering support. We believe that every pet deserves the best
            care, and every owner deserves peace of mind.
          </p>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-12 text-center'>
            What Sets Us Apart
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: 'Quality Products',
                description:
                  'We carefully curate our selection to offer only the best for your pets.',
                icon: '🏆',
              },
              {
                title: 'Expert Advice',
                description:
                  'Our team of pet care specialists is always ready to help.',
                icon: '🧠',
              },
              {
                title: 'Community Focus',
                description:
                  'We actively support local animal shelters and rescue organizations.',
                icon: '🤝',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-md text-center'
              >
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className='bg-secondary py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-12 text-center text-accent'>
            Meet Our Team
          </h2>
          <div className='grid md:grid-cols-4 gap-8'>
            {[
              {
                name: 'Jane Doe',
                role: 'Founder & CEO',
                image: '/doggies.jpg',
              },
              {
                name: 'John Smith',
                role: 'Head of Product',
                image: '/doggies.jpg',
              },
              {
                name: 'Emily Brown',
                role: 'Chief Veterinarian',
                image: '/doggies.jpg',
              },
              {
                name: 'Mike Johnson',
                role: 'Customer Care Manager',
                image: '/doggies.jpg',
              },
            ].map((member, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-lg shadow-md text-center'
              >
                <div className='relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden'>
                  <Image
                    src={member.image || '/placeholder.svg'}
                    alt={member.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-2'>{member.name}</h3>
                <p className='text-gray-600'>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='bg-accent text-muted py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-6'>Join the PetShop Family</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Experience the PetShop difference today. Shop our wide selection of
            premium pet products and join a community that truly cares about the
            well-being of your furry, feathered, or scaly friends.
          </p>
          <Button size='lg' variant={'secondary'} asChild>
            <Link href='/'>Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
