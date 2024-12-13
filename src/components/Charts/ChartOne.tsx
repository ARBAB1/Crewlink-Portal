"use client";

import { ApexOptions } from "apexcharts";
import React,{ useState, useEffect, use} from "react";
import dynamic from "next/dynamic";
import { message } from "antd";
import { baseUrl } from "@/constant";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const Token = localStorage.getItem("access_token"); // Fetch access token from local storage
const [userChartData, setUserChartData] = useState([]);
const [postChartData, setPostChartData] = useState([]);
  const fetchUser = async () => {
  
    try {
      const response = await fetch(
        `${baseUrl}/admin/dashboard/users-stats`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        setUserChartData(data.data);
    
      } else {
        message.error("Failed to fetch states");
      }
    } catch (error) {
      message.error("Error fetching states");
    }
  };
  const fetchPost = async () => {
  
    try {
      const response = await fetch(
        `${baseUrl}/admin/dashboard/posts-stats`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TwillioAPI",
            accesstoken: `Bearer ${Token}`,
          },
        },
      );
      const data = await response.json();
      if (data.statusCode === 200) {
   
        setPostChartData(data.data);
    
      } else {
        message.error("Failed to fetch states");
      }
    } catch (error) {
      message.error("Error fetching states");
    }
  };
  useEffect(() => {
fetchPost();
fetchUser();
  }, []);
  const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: [ "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 1735,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 800,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 850,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 5,
    colors: "#fff",
    strokeColors: [ "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    
    
    title: {
      style: {
        fontSize: "0px",
      },
    },
    stepSize: 5000,
    min: 0,
    max:  (Math.ceil(((Math.max(...userChartData))+(Math.max(...userChartData)*0.1))/10))*10,
  },
};

  const series = [
      {
        name: "User",
        data: userChartData,
      },

    
    ]

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
         
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Users</p>
              <p className="text-sm font-medium">{userChartData.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</p>
            </div>
          </div>
        </div>
       
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
