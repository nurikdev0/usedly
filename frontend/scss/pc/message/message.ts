// styles/chat.styles.ts
import { styled } from '@mui/material/styles';
import { Box, Paper, Theme } from '@mui/material';

export const ChatLayoutContainer = styled(Paper)(({ theme }: { theme: Theme }) => ({
	marginTop: '130px',
	display: 'flex',
	height: 'calc(100vh - 100px)',
	overflow: 'hidden',
	borderRadius: theme.spacing(2),
	boxShadow: theme.shadows[3],
	[theme.breakpoints.down('md')]: {
		flexDirection: 'column',
		height: 'calc(100vh - 140px)',
	},
}));

export const SidebarContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
	width: 700,
	borderRight: `1px solid ${theme.palette.divider}`,
	backgroundColor: theme.palette.background.paper,
	display: 'flex',
	flexDirection: 'column',
	[theme.breakpoints.down('md')]: {
		width: '100%',
		height: '40%',
		borderRight: 'none',
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
}));

export const MessagesContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: theme.palette.background.default,
	[theme.breakpoints.down('md')]: {
		height: '60%',
	},
}));

export const SidebarHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
	padding: theme.spacing(2.5),
	borderBottom: `1px solid ${theme.palette.divider}`,
	backgroundColor: theme.palette.background.paper,
}));

export const ChatHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
	padding: theme.spacing(2, 3),
	borderBottom: `1px solid ${theme.palette.divider}`,
	backgroundColor: theme.palette.background.paper,
}));

export const MessagesList = styled(Box)(({ theme }: { theme: Theme }) => ({
	flex: 1,
	padding: theme.spacing(2, 3),
	overflowY: 'auto',
	backgroundColor: theme.palette.background.default,
	'&::-webkit-scrollbar': {
		width: 6,
	},
	'&::-webkit-scrollbar-track': {
		background: theme.palette.action.hover,
	},
	'&::-webkit-scrollbar-thumb': {
		background: theme.palette.action.disabled,
		borderRadius: 3,
	},
}));

export const MessageInputContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
	padding: theme.spacing(2.5, 3),
	borderTop: `1px solid ${theme.palette.divider}`,
	backgroundColor: theme.palette.background.paper,
}));

export const MessageBubble = styled(Paper, {
	shouldForwardProp: (prop) => prop !== 'own' && prop !== 'sending',
})<{ own?: boolean; sending?: boolean }>(({ theme, own, sending }) => ({
	padding: theme.spacing(1.5, 2),
	borderRadius: theme.spacing(3),
	backgroundColor: own ? theme.palette.primary.main : theme.palette.background.paper,
	color: own ? theme.palette.primary.contrastText : theme.palette.text.primary,
	maxWidth: '70%',
	opacity: sending ? 0.7 : 1,
	boxShadow: theme.shadows[1],
	border: own ? 'none' : `1px solid ${theme.palette.divider}`,
}));

export const TypingDots = styled(Box)(({ theme }: { theme: Theme }) => ({
	display: 'flex',
	gap: theme.spacing(0.5),
}));

export const TypingDot = styled(Box)(({ theme }: { theme: Theme }) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: theme.palette.text.secondary,
	animation: 'typingAnimation 1.4s infinite ease-in-out',
	'&:nth-child(1)': { animationDelay: '-0.32s' },
	'&:nth-child(2)': { animationDelay: '-0.16s' },
	'@keyframes typingAnimation': {
		'0%, 80%, 100%': {
			transform: 'scale(0.8)',
			opacity: 0.5,
		},
		'40%': {
			transform: 'scale(1)',
			opacity: 1,
		},
	},
}));
