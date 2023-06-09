import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../404";

import AuthLayout from "../layout/authLayout";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import Verification, {loader as verificationLoader} from "../components/auth/verificaton";
import ForgetPassword, {loader as forgetPasswordLoader} from "../components/auth/forget-password";
import DashboardLayout from "../layout/dashboardLayout";
import DashboardWithAuth from "../pages/office/dashboard/page";
import ProfileWithAuth from "../pages/office/dashboard/profile/page";
import AffiliateWithAuth from "../pages/office/dashboard/referrals/page";
import KycwithDashoard from "../pages/office/dashboard/profile/kyc/page";
import InvestWithDashboard from "../pages/office/dashboard/deposits/page";
import DepositWithDashboard from "../pages/office/dashboard/deposits/invest/page";
import EarningWithDashboard from "../pages/office/dashboard/earnings/page";
import WithdrawalWithDashboard from "../pages/office/dashboard/withdrawals/page";
import CompoundingWithDashboard from "../pages/office/dashboard/compounding/page";
import CompoundingDepoWithDashboard from "../pages/office/dashboard/compounding/deposit/page";
import CompoundingInvestWithDashboard from "../pages/office/dashboard/compounding/deposit/invest/page";
import PlanWithDashboard,  {loader as PlanWithDashboardLoader} from "../pages/office/dashboard/compounding/deposit/invest/calculate/page";
import Root from "../pages/pages";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root
    },
    {
        element: <DashboardLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/office',
                children: [
                    {
                        path: "dashboard",
                        element: <DashboardWithAuth />,
                    },
                    {
                        path: "dashboard/profile",
                        element: <ProfileWithAuth />
                    },
                    {
                        path: "dashboard/referrals",
                        element: <AffiliateWithAuth />,
                    },
                    {
                        path: "dashboard/kyc",
                        element: <KycwithDashoard />,
                    },
                    {
                        path: "dashboard/deposits/invest",
                        element: <InvestWithDashboard />
                    },
                    {
                        path: "dashboard/deposits",
                        element: <DepositWithDashboard />,
                    },
                    {
                        path: "dashboard/earnings",
                        element: <EarningWithDashboard />
                    },
                    {
                        path: "dashboard/withdrawals",
                        element: <WithdrawalWithDashboard />,
                    },
                    {
                        path: "dashboard/compounding",
                        element: <CompoundingWithDashboard />,
                    },
                    {
                        path: "dashboard/compounding/deposit",
                        element: <CompoundingDepoWithDashboard />,
                    },
                    {
                        path: "dashboard/compounding/deposit/invest",
                        element: <CompoundingInvestWithDashboard />,
                    },
                    {
                        path: "dashboard/compounding/deposit/invest/calculate/:depositID",
                        element: <PlanWithDashboard />,
                        loader: PlanWithDashboardLoader
                    }
                ],
            }
        ]
    },
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,

        children: [
            {
                path: "/login",
                element: <Login/>
            },
            {
                element: <Register/>,
                path: "/register"
            },
            {
                path: "/verification/:token",
                element: <Verification />,
                loader: verificationLoader
            },
            {
                path: "/forget-password",
                element: <ForgetPassword />,
                loader: forgetPasswordLoader
            },
            {
                path: "/forget-password/:token",
                element: <ForgetPassword />,
                loader: forgetPasswordLoader
            },
        ]
    },
])


export default function App(){
    return <RouterProvider router={router} />
}