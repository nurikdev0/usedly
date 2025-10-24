import React, { useState } from 'react';

import {
	Box,
	Button,
	Stack,
	Typography,
	Avatar,
	Badge,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListItemButton,
} from '@mui/material';

import { ChatLayoutContainer, SidebarContainer, SidebarHeader } from '../../../scss/pc/message/message';
import AddIcon from '@mui/icons-material/Add';
import { NextPage } from 'next';
import { GET_ALL_CHAT_ROOMS } from '../../../apollo/user/query';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ChatRoomsInquiry } from '../../types/chat-room/chat-room.input';
import { ChatRoom } from '../../types/chat-room/chat-room';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { T } from '../../types/common';

const ChatList: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] = useState<ChatRoomsInquiry>(initialInput);
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	const {
		loading: getChatRoomsLoading,
		data: getChatRoomsData,
		error: getChatRoomsError,
		refetch: getChatRoomsRefetch,
	} = useQuery(GET_ALL_CHAT_ROOMS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setChatRooms(data?.getChatRooms?.list);
			setTotal(data?.getChatRooms?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const handleSelectRoom = async (id: string, sellerId: string, buyerId: string) => {
		const receiver = user._id === sellerId ? buyerId : sellerId;
		await router.push(
			{
				pathname: '/mypage',
				query: { category: 'messagesList', chatId: id, receiverId: receiver },
			},
			undefined,
			{ scroll: false },
		);
	};

	return (
		<ChatLayoutContainer>
			<SidebarContainer>
				<SidebarHeader>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="h6" component="h2" fontWeight="600">
							Conversations
						</Typography>
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							sx={{
								textTransform: 'none',
								borderRadius: 2,
							}}
						>
							New Chat
						</Button>
					</Stack>
				</SidebarHeader>

				<Box sx={{ flex: 1, overflow: 'auto' }}>
					<List disablePadding>
						{chatRooms.map((room) => (
							<ListItem key={room._id} disablePadding>
								<ListItemButton
									// selected={selectedRoom?._id === room._id}
									onClick={() => handleSelectRoom(room._id, room.sellerId, room.buyerId)}
									sx={{
										// borderRight: selectedRoom?._id === room._id ? 3 : 0,
										borderColor: 'primary.main',
										// backgroundColor: selectedRoom?._id === room._id ? 'action.selected' : 'transparent',
										// '&:hover': {
										// 	backgroundColor: selectedRoom?._id === room._id ? 'action.selected' : 'action.hover',
										// },
										py: 2,
										px: 2.5,
									}}
								>
									<ListItemAvatar sx={{ minWidth: 56 }}>
										<Badge
											overlap="circular"
											anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
											variant="dot"
											sx={{
												'& .MuiBadge-dot': {
													// backgroundColor: room.otherUser.isOnline ? 'success.main' : 'grey.400',
													width: 12,
													height: 12,
													borderRadius: '50%',
													border: '2px solid white',
												},
											}}
										>
											<Avatar
												// src={room.otherUser.memberImage}
												// alt={room.otherUser.memberNick}
												sx={{ width: 48, height: 48 }}
											/>
										</Badge>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
												<Typography variant="subtitle1" fontWeight="600" noWrap sx={{ maxWidth: '60%' }}>
													{/* {room.otherUser.memberNick} */}
												</Typography>
												<Stack direction="row" alignItems="center" spacing={0.5}>
													<Typography variant="caption" color="text.secondary" noWrap>
														{/* {formatTime(room.timestamp)} */}
													</Typography>
													{/* {room.unreadCount > 0 && (
														<Chip
															label={room.unreadCount}
															size="small"
															color="error"
															sx={{
																minWidth: 20,
																height: 20,
																fontSize: '0.75rem',
																fontWeight: 'bold',
															}}
														/>
													)} */}
												</Stack>
											</Stack>
										}
										secondary={
											<Stack spacing={0.5}>
												<Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>
													{room.lastMessage}
												</Typography>
												<Typography variant="caption" color="primary.main" fontWeight="500" noWrap>
													{/* {room.propertyTitle} */}
												</Typography>
											</Stack>
										}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</SidebarContainer>
		</ChatLayoutContainer>
	);
};

ChatList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default ChatList;
