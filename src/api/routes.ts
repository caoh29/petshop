export type Route = {
  title: string;
  href?: string;
  isProtected: boolean;
  children?: Route[];
};

export const ROUTES: Route[] = [
  {
    title: 'Home',
    isProtected: false,
    href: '/',
  },
  {
    title: 'Shop by Pet',
    isProtected: false,
    children: [
      {
        title: 'Dogs',
        isProtected: false,
        href: '/dogs',
        children: [
          {
            title: 'Raw Food',
            isProtected: false,
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            isProtected: false,
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            isProtected: false,
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            isProtected: false,
            href: '/bowls',
          },
          {
            title: 'Daycare',
            isProtected: false,
            href: '/daycare',
          },
          {
            title: 'Toys',
            isProtected: false,
            href: '/toys',
          },
          {
            title: 'Leashes',
            isProtected: false,
            href: '/leashes',
          },
          {
            title: 'Beds',
            isProtected: false,
            href: '/beds',
          },
        ],
      },
      {
        title: 'Cats',
        isProtected: false,
        href: '/cats',
        children: [
          {
            title: 'Raw Food',
            isProtected: false,
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            isProtected: false,
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            isProtected: false,
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            isProtected: false,
            href: '/bowls',
          },
          {
            title: 'Daycare',
            isProtected: false,
            href: '/daycare',
          },
          {
            title: 'Toys',
            isProtected: false,
            href: '/toys',
          },
          {
            title: 'Leashes',
            isProtected: false,
            href: '/leashes',
          },
          {
            title: 'Beds',
            isProtected: false,
            href: '/beds',
          },
        ],
      },
      {
        title: 'Birds',
        isProtected: false,
        href: '/birds',
        children: [
          {
            title: 'Food',
            isProtected: false,
            href: '/food',
          },
          {
            title: 'Bowls',
            isProtected: false,
            href: '/bowls',
          },
          {
            title: 'Daycare',
            isProtected: false,
            href: '/daycare',
          },
          {
            title: 'Cages',
            isProtected: false,
            href: '/cages',
          },
        ],
      },
      {
        title: 'Fishes',
        isProtected: false,
        href: '/fishes',
        children: [
          {
            title: 'Food',
            isProtected: false,
            href: '/food',
          },
          {
            title: 'Decoration',
            isProtected: false,
            href: '/decoration',
          },
          {
            title: 'Daycare',
            isProtected: false,
            href: '/daycare',
          },
          {
            title: 'Tanks',
            isProtected: false,
            href: '/tanks',
          },
        ],
      },
      {
        title: 'Reptiles',
        isProtected: false,
        href: '/reptiles',
        children: [
          {
            title: 'Food',
            isProtected: false,
            href: '/food',
          },
          {
            title: 'Decoration',
            isProtected: false,
            href: '/decoration',
          },
          {
            title: 'Daycare',
            isProtected: false,
            href: '/daycare',
          },
          {
            title: 'Terrariums',
            isProtected: false,
            href: '/terrariums',
          },
          {
            title: 'Stands',
            isProtected: false,
            href: '/stands',
          },
        ],
      },
      {
        title: 'Others',
        isProtected: false,
        href: '/others',
        children: [
          {
            title: 'Hamster',
            isProtected: false,
            href: '/hamster',
          },
          {
            title: 'Pig',
            isProtected: false,
            href: '/pig',
          },
          {
            title: 'Rabbit',
            isProtected: false,
            href: '/rabbit',
          },
        ],
      },
    ],
  },
  {
    title: 'Best Sellers',
    isProtected: false,
    href: '/best-sellers',
  },
  {
    title: 'Deals',
    isProtected: false,
    href: '/deals',
  },
  {
    title: 'New Arrivals',
    isProtected: false,
    href: '/new-arrivals',
  },
  // {
  //   title: 'Rewards',
  //   isProtected: false,
  //   href: '/rewards',
  // },
  // {
  //   title: 'Gift Cards',
  //   isProtected: false,
  //   href: '/gift-cards',
  // },
  {
    title: 'About Us',
    isProtected: false,
    href: '/about-us',
  },
  {
    title: 'Profile',
    isProtected: true,
    href: '/profile',
  },
  {
    title: 'Orders',
    isProtected: true,
    href: '/orders',
  },
  {
    title: 'Admin',
    isProtected: true,
    href: '/admin',
    // children: [
    //   {
    //     title: 'Products',
    //     isProtected: true,
    //     href: '/admin/products',
    //   },
    //   {
    //     title: 'Orders',
    //     isProtected: true,
    //     href: '/admin/orders',
    //   },
    //   {
    //     title: 'Users',
    //     isProtected: true,
    //     href: '/admin/users',
    //   },
    // ],
  },
];

const getAllValidRoutes = (routes: Route[], basePath: string = ''): Set<string> => {
  const validRoutes = new Set<string>();

  const traverseRoutes = (routes: Route[], basePath: string): void => {
    routes.forEach((route) => {
      const fullPath = `${basePath}${route.href ?? ''}`;
      if (route.href) {
        validRoutes.add(fullPath);
      }
      if (route.children) {
        traverseRoutes(route.children, fullPath);
      }
    });
  };

  traverseRoutes(routes, basePath);
  return validRoutes;
};

const getAllProtectedRoutes = (routes: Route[], basePath: string = ''): Set<string> => {
  const validRoutes = new Set<string>();

  // const traverseRoutes = (routes: Route[], basePath: string): void => {
  const traverseRoutes = (routes: Route[]): void => {
    // Adding the filter so it only iterates over protected ones
    routes.filter((route) => route.isProtected).forEach((route) => {
      // const fullPath = `${basePath}${route.href ?? ''}`;
      if (route.href) {
        validRoutes.add(route.href);
      }
      if (route.children) {
        traverseRoutes(route.children);
      }
    });
  };

  // traverseRoutes(routes, basePath);
  traverseRoutes(routes);
  return validRoutes;
};

export const VALID_ROUTES = getAllValidRoutes(ROUTES);

export const PROTECTED_ROUTES = getAllProtectedRoutes(ROUTES);