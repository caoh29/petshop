// 'use client';

// import { usePathname, useSearchParams } from 'next/navigation';
// import {
//   Pagination as Pag,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from './ui/pagination';

// interface Props {
//   totalPages: number;
//   currentPage?: number;
// }

// export function Pagination({
//   totalPages = 1,
//   currentPage = 1,
// }: Readonly<Props>) {
//   const pathName = usePathname();
//   const searchParams = useSearchParams();
//   // const currentPage = Number(searchParams.get('page')) ?? 1;
//   const prevPage = currentPage - 1;
//   const nextPage = currentPage + 1;

//   const createPageUrl = (pageNumber: number | string) => {
//     if (+pageNumber <= 0) return pathName;

//     if (+pageNumber > totalPages)
//       return `${pathName}?${searchParams.toString()}`;

//     return `${pathName}?page=${pageNumber}`;
//   };

//   return (
//     <div>
//       <Pag>
//         <PaginationContent>
//           {currentPage > 1 && (
//             <>
//               <PaginationItem>
//                 <PaginationPrevious href={createPageUrl(prevPage)} />
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href={createPageUrl(prevPage)}>
//                   {prevPage}
//                 </PaginationLink>
//               </PaginationItem>
//             </>
//           )}
//           <PaginationItem>
//             <PaginationLink href={createPageUrl(currentPage)} isActive>
//               {currentPage}
//             </PaginationLink>
//           </PaginationItem>
//           {currentPage < totalPages && (
//             <>
//               <PaginationItem>
//                 <PaginationLink href={createPageUrl(nextPage)}>
//                   {nextPage}
//                 </PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationEllipsis />
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationNext href={createPageUrl(nextPage)} />
//               </PaginationItem>
//             </>
//           )}
//         </PaginationContent>
//       </Pag>
//     </div>
//   );
// }

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination as Pag,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface Props {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: Readonly<Props>) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathName}?${params.toString()}`;
  };

  const getActiveStyles = (isActive: boolean) => {
    return isActive ? 'bg-blue-500' : '';
  };

  const renderPageLinks = () => {
    const pageLinks = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={currentPage === i}
              className={getActiveStyles(currentPage === i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Always show first page
      pageLinks.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={createPageUrl(1)}
            isActive={currentPage === 1}
            className={getActiveStyles(currentPage === 1)}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (showEllipsisStart) {
        pageLinks.push(
          <PaginationItem key='ellipsis-start'>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show current page and adjacent pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={currentPage === i}
              className={getActiveStyles(currentPage === i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (showEllipsisEnd) {
        pageLinks.push(
          <PaginationItem key='ellipsis-end'>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Always show last page
      pageLinks.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={createPageUrl(totalPages)}
            isActive={currentPage === totalPages}
            className={getActiveStyles(currentPage === totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pageLinks;
  };

  return (
    <Pag>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {renderPageLinks()}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pag>
  );
}
