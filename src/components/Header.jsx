import { ChevronLeft, MoreVertical } from "lucide-react";
import React from "react";

const Header = ({ title }) => (
  <div className="flex justify-between items-center p-4">
    <ChevronLeft className="w-6 h-6" />
    <h1 className="text-lg font-bold">{title}</h1>
    <MoreVertical className="w-6 h-6" />
  </div>
);

export default Header;
