import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_ALL_NOTICES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { AllNoticesInquiry } from '../../types/notice/notice.input';
import { NoticeGroup } from '../../enums/notice.enum';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = ({ initialInquiry, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('product');
	const [expanded, setExpanded] = useState<string | false>('panel1');

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
	const changeCategoryHandler = (category: string) => {
		const updatedGroupMap: Record<string, NoticeGroup> = {
			product: NoticeGroup.PRODUCT,
			forbuyers: NoticeGroup.FORBUYERS,
			forusers: NoticeGroup.FORUSERS,
			membership: NoticeGroup.MEMBERSHIP,
			community: NoticeGroup.COMMUNITY,
			other: NoticeGroup.OTHER,
		};

		const newGroup = updatedGroupMap[category];

		const updatedInquiry: AllNoticesInquiry = {
			...noticesInquiry,
			search: {
				...noticesInquiry.search,
				noticeGroup: newGroup,
			},
		};

		setCategory(category);
		setNoticesInquiry(updatedInquiry);
		getAllNoticesRefetch({ input: updatedInquiry });
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'product' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('product');
						}}
					>
						Product
					</div>
					<div
						className={category === 'forbuyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('forbuyers');
						}}
					>
						For Buyers
					</div>
					<div
						className={category === 'forusers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('forusers');
						}}
					>
						For Users
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{notices.length > 0 &&
						notices.map((ele: any) => (
							<Accordion expanded={expanded === ele?._id} onChange={handleChange(ele?._id)} key={ele?._id}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography>{ele?.noticeTitle}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography>{ele?.noticeContent}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

Faq.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			noticeCategory: 'FAQ',
			noticeGroup: 'PRODUCT',
		},
	},
};

export default Faq;
