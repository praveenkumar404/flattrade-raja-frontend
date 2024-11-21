import * as React from 'react';
import { createTheme, extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, AuthenticationContext, Navigation, SessionContext } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import OrderPages from './Pages/OrderPages/OrderPages';
import AlgoTradersPages from './Pages/AlgoTraders/AlgoTradersPages';
import { Avatar, Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import Profilepage from './Pages/authProfile/Profilepage';
import { Account } from '@toolpad/core';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import NotificationComponent from '../comman/NotificationComponent';
import '../assets/css/DashboardLayoutPages.css'
import { useDispatch } from 'react-redux';
import { resetAuthState } from '../redux/authSlice';
import '../assets/css/style.css'

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'algotrading',
    title: 'Algotrading',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

// const demoTheme = extendTheme({
//   colorSchemes: { light: true, dark: true },
//   colorSchemeSelector: 'class',
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });


const customTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#F9F9FE',
            paper: '#EEEEF9',
          },
          text: {
            primary: '#000',  // Define light mode primary text color
            secondary: 'dodgerblue',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#2A4364',
            paper: '#112E4D',
          },
          text: {
            primary: '#ffffff',  // Define dark mode primary text color
            secondary: 'dodgerblue',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });


const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '""',
}));

export default function DashboardLayoutPages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Handle navigation change with React Router
  const handleNavigation = (segment: string) => {
    navigate(`/${segment}`);
  };

  const onclickprofilepage = () =>{
    navigate('/profile')
  }

  const demoSession = {
    user: {
        name: 'Bharat Kashyap',
        email: 'bharatkashyap@outlook.com',
        image: 'https://imgcdn.stablediffusionweb.com/2024/6/12/4d688bcf-f53b-42b6-a98d-3254619f3b58.jpg',
      },
  }

  

  const handleLogout = () => {
    setTimeout(()=>{
      dispatch(resetAuthState());
      console.log('User logged out');
    },1500)
    
  };


  const CustomMenu = () =>{
    return(
        <Box>
            <Box
            sx={{
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              }
            }}
        // transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onclickprofilepage}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Box>
        </Box>
    )
  }
  const [session, setSession] = React.useState<any | null>(demoSession);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(demoSession);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);



  return (
    <Box className="DashboardAppprovider">
    <AppProvider
      navigation={NAVIGATION}
      onNavigate={({ segment }: { segment: string }) => handleNavigation(segment)}
      theme={customTheme}
      branding={{
        logo: <img src="https://flattrade.in/images/icon/stairs.svg" alt="Flattrade logo" style={{width:'30px',height:'30px'}}/>,
        title: 'FLATTRADE App',
      }}
      session={session}
    //   authentication={authentication}
    >
        <Box sx={{display:'flex',justifyContent:'flex-end',alignItems:'center',position:'fixed',columnGap:'15px',zIndex:1400,right:'10px',top:'15px'}}>
        <Box><NotificationComponent/></Box>
        <Box>
        <AuthenticationContext.Provider value={authentication}>
        <SessionContext.Provider value={session}>
        {/* preview-start */}
        <Account
          slots={{
            popoverContent: CustomMenu,
          }}
        />
        {/* preview-end */}
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
    </Box>
    </Box>

      <DashboardLayout>
        <PageContainer>
          <Routes>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/orders" element={<OrderPages />} />
            <Route path="/algotrading" element={<AlgoTradersPages />} />
            <Route path="/profile" element={<Profilepage />} />
          </Routes>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
    </Box>
  );
}









// import * as React from 'react';
// import { extendTheme, styled } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import DescriptionIcon from '@mui/icons-material/Description';
// import LayersIcon from '@mui/icons-material/Layers';
// import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { PageContainer } from '@toolpad/core/PageContainer';
// import Grid from '@mui/material/Grid2';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import Dashboard from './Dashboard';
// import OrderPages from './Pages/OrderPages/OrderPages';
// import AlgoTradersPages from './Pages/AlgoTraders/AlgoTradersPages';
// import { Box, Typography } from '@mui/material';

// const NAVIGATION: Navigation = [
//   {
//     kind: 'header',
//     title: 'Main items',
//   },
//   {
//     segment: 'dashboard',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'orders',
//     title: 'Orders',
//     icon: <ShoppingCartIcon />,
//   },
//   {
//     segment: 'algotraders',
//     title: 'Algotraders',
//     icon: <ShoppingCartIcon />,
//   },
//   {
//     kind: 'divider',
//   },
//   {
//     kind: 'header',
//     title: 'Analytics',
//   },
//   {
//     segment: 'reports',
//     title: 'Reports',
//     icon: <BarChartIcon />,
//     children: [
//       {
//         segment: 'sales',
//         title: 'Sales',
//         icon: <DescriptionIcon />,
//       },
//       {
//         segment: 'traffic',
//         title: 'Traffic',
//         icon: <DescriptionIcon />,
//       },
//     ],
//   },
//   {
//     segment: 'integrations',
//     title: 'Integrations',
//     icon: <LayersIcon />,
//   },
// ];

// const demoTheme = extendTheme({
//   colorSchemes: { light: true, dark: true },
//   colorSchemeSelector: 'class',
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });



// const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
//   backgroundColor: theme.palette.action.hover,
//   borderRadius: theme.shape.borderRadius,
//   height,
//   content: '" "',
// }));


// export default function DashboardLayoutPages(props: any) {

//     const [pathname, setPathname] = React.useState('/dashboard');

//     const navigate = useNavigate();

//   // Handle navigation change with React Router
//   const handleNavigation = (segment: string) => {
//     navigate(`/${segment}`);
//   };

//     function useDemoRouter(initialPath: string): Router {
        
      
//         const router = React.useMemo(() => {
//           return {
//             pathname,
//             searchParams: new URLSearchParams(),
//             navigate: (path: string | URL) => setPathname(String(path)),
//           };
//         }, [pathname]);
      
//         return router;
//       }

//       function DemoPageContent({ pathname }: { pathname: string }) {
//     return (
//       <Box
//         sx={{
//           py: 4,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           textAlign: 'center',
//         }}
//       >
//         <Typography>Dashboard content for {pathname}</Typography>
//       </Box>
//     );
//   }

//   const { window } = props;

//   const router = useDemoRouter('/dashboard');

//   // Remove this const when copying and pasting into your project.
//   const demoWindow = window ? window() : undefined;
  

//   return (
//     <AppProvider
//       navigation={NAVIGATION}
//       router={router}
//       theme={demoTheme}
//       window={demoWindow}
//       onNavigate={({ segment }:any) => handleNavigation(segment)}
//     >
//       <DashboardLayout>
//         <div>Path Name : {}</div>
//       <DemoPageContent pathname={router.pathname} />
//           <PageContainer>
//             {/* Define Routes */}
//             <Routes>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/orders" element={<OrderPages />} />
//               <Route path="/algotraders" element={<AlgoTradersPages />} />
//               {/* Add more routes as necessary */}
//             </Routes>
//           </PageContainer>
//         </DashboardLayout>
//     </AppProvider>
//   );
// }
