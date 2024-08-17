export type Route = {
  title: string;
  href?: string;
  children?: Route[];
};

export const ROUTES: Route[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Shop by Pet',
    children: [
      {
        title: 'Dogs',
        href: '/dogs',
        children: [
          {
            title: 'Raw Food',
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Toys',
            href: '/toys',
          },
          {
            title: 'Leashes',
            href: '/leashes',
          },
          {
            title: 'Beds',
            href: '/beds',
          },
        ],
      },
      {
        title: 'Cats',
        href: '/cats',
        children: [
          {
            title: 'Raw Food',
            href: '/raw-food',
          },
          {
            title: 'Wet Food',
            href: '/wet-food',
          },
          {
            title: 'Dry Food',
            href: '/dry-food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Toys',
            href: '/toys',
          },
          {
            title: 'Leashes',
            href: '/leashes',
          },
          {
            title: 'Beds',
            href: '/beds',
          },
        ],
      },
      {
        title: 'Birds',
        href: '/birds',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Bowls',
            href: '/bowls',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Cages',
            href: '/cages',
          },
        ],
      },
      {
        title: 'Fishes',
        href: '/fishes',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Decoration',
            href: '/decoration',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Tanks',
            href: '/tanks',
          },
        ],
      },
      {
        title: 'Reptiles',
        href: '/reptiles',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Decoration',
            href: '/decoration',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
          {
            title: 'Terrariums',
            href: '/terrariums',
          },
          {
            title: 'Stands',
            href: '/stands',
          },
        ],
      },
      {
        title: 'Others',
        href: '/others',
        children: [
          {
            title: 'Food',
            href: '/food',
          },
          {
            title: 'Decoration',
            href: '/decoration',
          },
          {
            title: 'Daycare',
            href: '/daycare',
          },
        ],
      },
    ],
  },
  {
    title: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    title: 'Rewards',
    href: '/rewards',
  },
  {
    title: 'Gift Cards',
    href: '/gift-cards',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

const getAllValidRoutes = (routes: Route[], basePath: string = ''): Set<string> => {
  const validRoutes = new Set<string>();

  const traverseRoutes = (routes: Route[], basePath: string): void => {
    routes.forEach((route) => {
      const fullPath = `${basePath}${route.href || ''}`;
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

export const VALID_ROUTES = getAllValidRoutes(ROUTES);