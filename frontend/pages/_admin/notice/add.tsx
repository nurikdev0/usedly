import React, { useCallback, useState } from 'react';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Button, Stack, Typography } from '@mui/material';
import { NoticeInput } from '../../../libs/types/notice/notice.input';
import { useMutation } from '@apollo/client';
import { CREATE_NOTICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import router from 'next/router';
import { NoticeCategory, NoticeGroup } from '../../../libs/enums/notice.enum';

const AdminAddNotice = ({ initialValues, ...props }: any) => {
	const [insertNoticeData, setInsertNoticeData] = useState<NoticeInput>(initialValues);
	const [noticeCategory, setNoticeCategory] = useState<NoticeCategory[]>(Object.values(NoticeCategory));
	const [noticeGroup, setNoticeGroup] = useState<NoticeGroup[]>(Object.values(NoticeGroup));

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE_BY_ADMIN);

	const doDisabledCheck = () => {
		if (
			// @ts-ignore
			insertNoticeData.noticeCategory === '' || // @ts-ignore
			insertNoticeData.noticeTitle === '' || // @ts-ignore
			insertNoticeData.noticeContent === '' // @ts-ignore
		) {
			return true;
		}
	};

	const insertNoticeHandler = useCallback(async () => {
		try {
			if (
				// @ts-ignore
				insertNoticeData.noticeGroup === '' || // @ts-ignore
				insertNoticeData.noticeGroup === 'select'
			) {
				delete insertNoticeData.noticeGroup;
			}

			const result = await createNotice({
				variables: {
					input: insertNoticeData,
				},
			});

			await sweetMixinSuccessAlert('This notice has been created successfully.');
			await router.push({
				pathname: '/_admin/notice',
				query: {
					category: 'notice',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertNoticeData]);

	return (
		<div id="my-page" style={{ position: 'relative' }}>
			<Stack className={'my-page'}>
				<div id="add-property-page">
					<div>
						<Stack className="config">
							<Stack className="description-box">
								<Stack className="config-column">
									<Typography>Title</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Title'}
										value={insertNoticeData.noticeTitle}
										onChange={({ target: { value } }) =>
											setInsertNoticeData({ ...insertNoticeData, noticeTitle: value })
										}
									/>
								</Stack>

								<Stack className="config-row">
									<Stack className="price-year-after-price">
										<Typography>Select Category</Typography>
										<select
											className={'select-description'}
											defaultValue={insertNoticeData.noticeCategory || 'select'}
											value={insertNoticeData.noticeCategory || 'select'}
											onChange={({ target: { value } }) =>
												// @ts-ignore
												setInsertNoticeData({ ...insertNoticeData, noticeCategory: value })
											}
										>
											<>
												<option selected={true} disabled={true} value={'select'}>
													Select
												</option>
												{noticeCategory.map((category: any) => (
													<option value={`${category}`} key={category}>
														{category}
													</option>
												))}
											</>
										</select>
										<div className={'divider'}></div>
										<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
									</Stack>
									{insertNoticeData.noticeCategory === 'NOTICE' ? (
										<Stack className="price-year-after-price"></Stack>
									) : (
										<Stack className="price-year-after-price">
											<Typography>Select Group</Typography>
											<select
												className={'select-description'}
												defaultValue={insertNoticeData.noticeGroup || 'select'}
												value={insertNoticeData.noticeGroup || 'select'}
												onChange={({ target: { value } }) =>
													// @ts-ignore
													setInsertNoticeData({ ...insertNoticeData, noticeGroup: value })
												}
											>
												<>
													<option selected={true} disabled={true} value={'select'}>
														Select
													</option>
													{noticeGroup.map((group: any) => (
														<option value={`${group}`} key={group}>
															{group}
														</option>
													))}
												</>
											</select>
											<div className={'divider'}></div>
											<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
										</Stack>
									)}
								</Stack>

								<Stack className="config-column">
									<Typography>Description</Typography>
									<textarea
										name=""
										id=""
										className="description-text"
										value={insertNoticeData.noticeContent}
										onChange={({ target: { value } }) =>
											setInsertNoticeData({ ...insertNoticeData, noticeContent: value })
										}
									></textarea>
								</Stack>
								<Stack className="buttons-row">
									<Button className="next-button" disabled={doDisabledCheck()} onClick={insertNoticeHandler}>
										<Typography className="next-button-text">Save</Typography>
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</div>
				</div>
			</Stack>
		</div>
	);
};

AdminAddNotice.defaultProps = {
	initialValues: {
		noticeCategory: '',
		noticeGroup: '',
		noticeTitle: '',
		noticeContent: '',
	},
};
export default withAdminLayout(AdminAddNotice);
