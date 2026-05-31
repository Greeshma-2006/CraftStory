import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ links, title }) => {

  return (

    <div className="bg-white rounded-[35px] shadow-xl p-8 h-fit">

      <h2 className="text-3xl font-bold text-[#6B3E2E] mb-8">
        {title}
      </h2>

      <div className="flex flex-col gap-4">

        {links.map((link, index) => (

          <Link
            key={index}
            to={link.path}
            className="px-5 py-4 rounded-2xl bg-[#F5E6D3] hover:bg-[#C96A4A] hover:text-white text-[#6B3E2E] transition-all font-medium"
          >
            {link.label}
          </Link>

        ))}

      </div>

    </div>
  );
};

export default Sidebar;