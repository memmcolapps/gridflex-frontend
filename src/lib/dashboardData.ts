

export const chartData = [
  { month: "Jan", value: 70 },
  { month: "Feb", value: 60 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 30 },
  { month: "May", value: 40 },
  { month: "Jun", value: 15 },
  { month: "Jul", value: 20 },
  { month: "Aug", value: 60 },
  { month: "Sep", value: 95 },
  { month: "Oct", value: 90 },
  { month: "Nov", value: 75 },
  { month: "Dec", value: 80 },
];

export const statusCards = [
  {
    title: "Total Meters",
    value: "4,200",
    change: "+11.01%",
    url: "/data-management/meter-management",
    changeColor: "text-black",
    bgColor: "bg-[rgba(219,230,254,1)]",
    borderColor: "border-blue-100",
    textColor: "text-black",
    icon: "CircleCheckBig",
    iconBgColor: "bg-[rgba(191,211,254,1)]",
    iconColor: "text-[rgba(22,28,202,1)]",
  },
  {
    title: "Allocated",
    value: "400",
    change: "-1.01%",
    changeColor: "text-black",
    url: "",
    bgColor: "bg-[rgb(254,246,195)]",
    borderColor: "border-yellow-100",
    textColor: "text-black",
    icon: "CircleAlert",
    iconBgColor: "bg-[rgba(254,231,138,1)]",
    iconColor: "text-[rgba(235,161,62,1)]",
  },
  {
    title: "Assigned",
    value: "1,200",
    change: "+2.20%",
    changeColor: "text-black",
    url: "",
    bgColor: "bg-emerald-100",
    borderColor: "border-green-100",
    textColor: "text-black",
    icon: "CircleCheckBig",
    iconBgColor: "bg-emerald-200",
    iconColor: "text-[rgba(34,197,94,1)]",
  },
  {
    title: "Deactivated",
    value: "320",
    change: "-2.08%",
    changeColor: "text-black",
    url: "",
    bgColor: "bg-[rgb(216,219,223)]",
    borderColor: "border-gray-200",
    textColor: "text-black",
    icon: "CircleX",
    iconBgColor: "bg-[rgba(182,186,195,1)]",
    iconColor: "text-[rgb(37,39,44)]",
  },
];

export const manufacturerData = {
  series: [20, 10, 5, 5, 5, 5, 5, 5, 5, 15, 5, 5, 5, 5, 5, 5],
  labels: [
    "Memmcol",
    "Google",
    "Amazon",
    "Prime",
    "Netflix",
    "CN",
    "Nick",
    "Disney",
    "Shop",
  ],
  colors: [
    "#C9E4DE",
    "#769FCD",
    "#5D8AA8",
    "#A4C3B2",
    "#A3C4F3",
    "#FFE0AC",
    "#FFBCBC",
    "#4CAF50",
    "#BFD8B8",
    "#FFE0AC",
    "#EDE7B1",
    "#BFD3FE",
    "#FFBCBC",
    "#A4C3B2",
    "#00BCD4",
    "#8BC34A",
    "#DDBDD5",
  ],
};

interface HesStatusCard {
  title: string;
  value: string;
  status: string;
  url: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string; // Use string to reference icon names
  iconBgColor: string;
  iconColor: string;
}

export const hesStatusCards: HesStatusCard[] = [
  {
    title: "Total Smart Meters",
    value: "4,200",
    status: "",
    url: "",
    bgColor: "bg-[#DBE6FE]",
    borderColor: "border-[#DBE6FE]",
    textColor: "text-black",
    icon: "CircleCheckBig", // Icon name as string
    iconBgColor: "bg-[#BFD3FE] rounded-full",
    iconColor: "text-blue-500",
  },
  {
    title: "Online",
    value: "1,200",
    status: "",
    url: "",
    bgColor: "bg-[#DCFCE8]",
    borderColor: "border-[#DCFCE8]",
    textColor: "text-black",
    icon: "CircleCheck", // Icon name as string
    iconBgColor: "bg-[rgba(134,239,172,0.5)]",
    iconColor: "text-green-500",
  },
  {
    title: "Offline",
    value: "400",
    status: "",
    url: "",
    bgColor: "bg-[#FEF2C3]",
    borderColor: "border-[#FEF2C3]",
    textColor: "text-black",
    icon: "Ban", // Icon name as string
    iconBgColor: "bg-[#FEE78A]",
    iconColor: "text-yellow-500",
  },
  {
    title: "Failed Commands",
    value: "20",
    status: "",
    url: "",
    bgColor: "bg-[#D8DBDF]",
    borderColor: "border-[#D8DBDF]",
    textColor: "text-black",
    icon: "CircleXIcon", // Icon name as string
    iconBgColor: "bg-[#B6BAC3]",
    iconColor: "text-gray-500",
  },
];

export const meterStatusData = {
  series: [25, 50, 10, 15],
  labels: ["In-stock", "Assigned", "Deactivated", "Unassigned"],
  colors: ["#1E4BAF", "#10B981", "#B22222", "#FFB000"],
};