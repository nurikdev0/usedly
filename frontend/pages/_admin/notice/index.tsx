import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_NOTICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { NoticePanelList } from '../../../libs/components/admin/notices/NoticeList';
import { AllNoticesInquiry } from '../../../libs/types/notice/notice.input';
import { Notice } from '../../../libs/types/notice/notice';
import router from 'next/router';

const AdminNotices: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<AllNoticesInquiry>(initialInquiry);
	const [notices, setNotices] = useState<Notice[]>([]);
	const [noticesTotal, setNoticesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);

	/** APOLLO REQUESTS **/
	const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const {
		loading: getAllNoticesByAdminLoading,
		data: getAllNoticesByAdminData,
		error: getAllNoticesByAdminError,
		refetch: getAllNoticesByAdminRefetch,
	} = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getAllNoticesByAdmin?.list);
			setNoticesTotal(data?.getAllNoticesByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllNoticesByAdminRefetch({ input: noticesInquiry }).then();
	}, [noticesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		noticesInquiry.page = newPage + 1;
		getAllNoticesByAdminRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		noticesInquiry.limit = parseInt(event.target.value, 10);
		noticesInquiry.page = 1;
		getAllNoticesByAdminRefetch({ input: noticesInquiry });
		setNoticesInquiry({ ...noticesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const removePropertyHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeNoticeByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllNoticesByAdminRefetch({ input: noticesInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				CS List
			</Typography>

			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
									All
								</ListItem>
							</List>
							<Divider />

							<Divider />
						</Box>
						<NoticePanelList
							notices={notices}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							removePropertyHandler={removePropertyHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={noticesTotal}
							rowsPerPage={noticesInquiry?.limit}
							page={noticesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotices.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminNotices);
