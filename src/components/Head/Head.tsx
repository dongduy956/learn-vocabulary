import { FC } from 'react';
import { Helmet } from 'react-helmet';
import { PropsHead } from '~/interfaces';
const Head: FC<PropsHead> = ({ title }) => (
    <Helmet>
        <meta charSet="utf-8" />
        <title>{title} | Learn WordBook</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
    </Helmet>
);

export default Head;
