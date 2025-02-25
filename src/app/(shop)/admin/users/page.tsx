import { getPaginatedUsersAdminAction } from '@/app/api/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Link from 'next/link';
import Pagination from '@/app/components/Pagination';
import SortDropdown from '@/app/components/SortDropdown';

interface Props {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function AdminUsersPage({
  searchParams,
}: Readonly<Props>) {
  const { users, pages, currentPage } = await getPaginatedUsersAdminAction({
    searchParams,
  });

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold text-black'>Users</h1>
      <div className='flex flex-col items-end gap-8'>
        <SortDropdown items={users} />
        <Table>
          <TableHeader>
            <TableRow className='bg-primary hover:bg-primary'>
              <TableHead>User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className='text-right'>Guest</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className='bg-secondary hover:bg-secondary text-white'
                >
                  <TableCell className='font-medium'>
                    <Link
                      className='underline hover:text-ternary'
                      href={`/admin/users/${user.id}`}
                    >
                      {user.id}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.name ??
                      `${user.firstName}${user.firstName !== 'unknown' ? ` ${user.lastName}` : ''}`}
                  </TableCell>
                  <TableCell>{user.phone ?? 'No phone'}</TableCell>
                  <TableCell className='text-right'>
                    {user.isGuest ? 'Yes' : 'No'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pages > 1 && (
          <Pagination totalPages={pages} currentPage={currentPage || 1} />
        )}
      </div>
    </div>
  );
}
