import { Link } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  BeakerIcon,
  TagIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Fournisseurs', href: '/fournisseurs', icon: TruckIcon },
  { name: 'Carburants', href: '/carburants', icon: BeakerIcon },
  { name: 'Catégories', href: '/categories', icon: TagIcon },
  { name: 'Produits', href: '/produits', icon: CubeIcon },
  { name: 'Mouvements', href: '/mouvements', icon: ArrowsRightLeftIcon },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setOpen(false)}
                >
                  <item.icon
                    className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}