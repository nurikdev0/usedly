import React from 'react';
import { TableCell, TableHead, TableBody, TableRow, Table, TableContainer, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { Notice } from '../../../types/notice/notice';
import DeleteIcon from '@mui/icons-material/Delete';

interface Data {
	id: string;
	category: string;
	group: string;
	status: string;
	title: string;
	content: string;
	action: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'NOTICE ID',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'group',
		numeric: false,
		disablePadding: false,
		label: 'GROUP',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'content',
		numeric: false,
		disablePadding: false,
		label: 'CONTENT',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface NoticePanelListType {
	notices: Notice[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	removePropertyHandler: any;
}

export const NoticePanelList = (props: NoticePanelListType) => {
	const { notices, anchorEl, menuIconClickHandler, menuIconCloseHandler, removePropertyHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{notices.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{notices.length !== 0 &&
							notices.map((notice: Notice, index: number) => {
								return (
									<TableRow hover key={notice?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{notice._id}</TableCell>
										<TableCell align="center">{notice.noticeCategory}</TableCell>
										<TableCell align="center">{notice.noticeGroup}</TableCell>
										<TableCell align="center">{notice.noticeStatus}</TableCell>
										<TableCell align="center">{notice.noticeTitle}</TableCell>
										<TableCell align="center">{notice.noticeContent}</TableCell>
										<TableCell align="center">
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removePropertyHandler(notice._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
