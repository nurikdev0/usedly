import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Box, Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Product Search';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/basic-image.png';
					break;
				case '/agent':
					title = 'Users';
					desc = 'Browse user profiles and connect with others.';
					bgImage = '/img/banner/basic-image2.jpg';
					break;
				case '/agent/detail':
					title = 'User Profile';
					desc = 'View detailed information about this user, including their activity, interests, and profile summary.';
					bgImage = '/img/banner/basic-image2.jpg';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / my page';
					bgImage = '/img/banner/basic-image.png';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / Community';
					bgImage = '/img/banner/basic-image3.png';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / Community Detail';
					bgImage = '/img/banner/basic-image3.png';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/basic-image.png';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/basic-image.png';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'User Profile';
					desc =
						'Review the complete profile of this user, featuring personal information, biography, social links, and past activities.';
					bgImage = '/img/banner/basic-image.png';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								// background: ' rgb(31, 75, 63)',
								borderRadius: '16px',
								marginTop: '150px',
								marginLeft: '3%',
								marginRight: '3%',
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								// boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
