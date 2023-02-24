import { Suspense, FC } from 'react';

import Loader from './Loader';

const Loadable: FC = (Component) => (props) =>
    (
        <Suspense fallback={<Loader />}>
            <Component {...props} />
        </Suspense>
    );

export default Loadable;
