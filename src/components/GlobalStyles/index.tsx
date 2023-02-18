import { PropWithChildren } from '~/interfaces';
import './GlobalStyles.scss';
import { FC } from 'react';

const GlobalStyles: FC<PropWithChildren> = ({ children }) => {
    return <>{children}</>;
};

export default GlobalStyles;
