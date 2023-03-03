import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { configRoutes, configTitle } from '~/configs';
import { TypeConfig } from '~/interfaces';

const BreadcrumbCustom = () => {
    const { pathname }: { pathname: string } = useLocation();
    const [breadcrumbItem, setBreadcrumbItem] = useState<string>('');
    useEffect(() => {
        if (pathname.length > 1) {
            const key = Object.keys(configRoutes).find((x) => configRoutes[x as TypeConfig].trim() === pathname.trim());
            console.log(pathname, key);
            if (key) setBreadcrumbItem(configTitle[key as TypeConfig]);
        } else setBreadcrumbItem('');
    }, [pathname]);
    return (
        <Breadcrumb separator={<span>{breadcrumbItem.length ? '>' : ''}</span>}>
            <Breadcrumb.Item className={`${breadcrumbItem.length ? 'cursor-pointer' : 'opacity-60'}`}>
                {breadcrumbItem.length ? (
                    <Link to={configRoutes.dashboard} className="text-black">
                        {configTitle.dashboard}
                    </Link>
                ) : (
                    configTitle.dashboard
                )}
            </Breadcrumb.Item>
            <Breadcrumb.Item className="opacity-60">{breadcrumbItem}</Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default BreadcrumbCustom;
