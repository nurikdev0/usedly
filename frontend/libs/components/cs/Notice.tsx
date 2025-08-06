import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { AllNoticesInquiry } from '../../types/notice/notice.input';
import { T } from '../../types/common';
import { TextAlignRight } from 'phosphor-react';

const Notice = ({ initialInquiry, ...props }: any) => {
	const device = useDeviceDetect();
	const [noticesInquiry, setNoticesInquiry] = useState<AllNoticesInquiry>(initialInquiry);
	const [notices, setNotices] = useState<AllNoticesInquiry[]>([]);
	const [noticesTotal, setNoticesTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const {
		loading: getAllNoticesLoading,
		data: getAllNoticesData,
		error: getAllNoticesError,
		refetch: getAllNoticesRefetch,
	} = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getNotices?.list);
			setNoticesTotal(data?.getNotices?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	/** HANDLERS **/

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span style={{ textAlign: 'center', display: 'block', width: '100%' }}>title</span>
						<span style={{ textAlign: 'right', display: 'block', width: '10%' }}>date</span>
					</Box>
					<Stack className={'bottom'}>
						{notices.map((ele: any, index) => (
							<div className={`notice-card`} key={ele._id}>
								<span className="notice-number">{index++}</span>
								<span className="notice-title" style={{ textAlign: 'center', display: 'block', width: '100%' }}>
									{ele.noticeTitle}
								</span>
								<span className="notice-title" style={{ textAlign: 'right', display: 'block', width: '10%' }}>
									{new Date(ele.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

Notice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			noticeCategory: 'NOTICE',
		},
	},
};

export default Notice;
