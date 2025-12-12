'use client';
import React from 'react';
import Link from 'next/link';
import Clock from 'react-live-clock';


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs';

const BreadCrumbs = ({ values = [] }) => {
  const lastIndex = values.length - 1;

  return (
    <div className="flex justify-between gap-3 items-center  text-xs">
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {values.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className="capitalize text-xs">
                  {index === lastIndex ? (
                    <BreadcrumbPage className="flex items-center gap-1 text-xs">
                      {item.isOnlyIcon && item.icon}
                      {!item.isOnlyIcon && (
                        <>
                          {item.title}
                        </>
                      )}
                    </BreadcrumbPage>
                  ) : (
                    <Link href={item.href} className="flex items-center gap-1 text-xs">
                      {item.isOnlyIcon && item.icon}
                      {!item.isOnlyIcon && (
                        <>
                          {item.icon && <span className="mr-1">{item.icon}</span>}
                          {item.title}
                        </>
                      )}
                    </Link>
                  )}
                </BreadcrumbItem>

                {index !== lastIndex && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex-none">
      <Clock format={'dddd, MMMM Do YYYY, h:mm:ss a'} ticking={true} timezone={'Asia/Kolkata'} />
        </div>
    </div>
  );
};

export default BreadCrumbs;
