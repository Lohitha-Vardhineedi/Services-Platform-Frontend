import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Crown,
  Zap,
  Shield,
  Eye,
  AlertTriangle,
  ArrowRight,
  IndianRupee,
  Check,
  X,
} from "lucide-react";
import { getPlans, gettechnicianPlanById } from "../../api/apiMethods";

/* ──────────────────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────────────────── */
type PlanFeature = { name: string; included: boolean };
type PlanFullFeature = { text: string };

type Plan = {
  _id: string;
  name: "Economy Plan" | "Gold Plan" | "Platinum Plan" | "Free Plan" | string;
  originalPrice?: number | null;
  discount?: string;
  discountPercentage?: number | null;
  price: number;
  gstPercentage: number;
  gst: number;
  finalPrice: number;
  validity: number | null;
  leads: number | null;
  features?: PlanFeature[];
  fullFeatures?: PlanFullFeature[];
  isPopular?: boolean;
  isActive?: boolean;
  endUpPrice?: number | null;
  commisionAmount?: number;
  executiveCommissionAmount?: number;
  refExecutiveCommisionAmount?: number;
  referalCommisionAmount?: number;
};

type PlansResponse = { success: boolean; data: Plan[]; message: string };

type TechSubResult = {
  subscriptionId: string;
  subscriptionName: string;
  startDate: string;
  endDate: string | null;
  leads: number | null;
  ordersCount: number;
  earnAmount: number;
  _id: string;
};

type TechSubResponse = {
  success: boolean;
  message: string;
  result: {activePlan: TechSubResult | null , history: TechSubResult[]};
};

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────────────── */
const toINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const daysLeft = (endDate: string | null | undefined) => {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const clampPct = (used: number, total?: number | null) => {
  if (!total || total <= 0) return 0;
  const pct = (used / total) * 100;
  return Math.max(0, Math.min(100, pct));
};

// per plan theme (no unsafe dynamic classnames; palette is whitelisted)
const THEME: Record<
  string,
  {
    icon: React.ComponentType<any>;
    gradient: string;
    pill: string;
    ring: string;
    bar: string;
    chip: string;
  }
> = {
  "Economy Plan": {
    icon: Zap,
    gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600",
    pill: "bg-blue-50 text-blue-700",
    ring: "ring-blue-200",
    bar: "bg-indigo-600",
    chip: "bg-blue-100 text-blue-800",
  },
  "Gold Plan": {
    icon: Star,
    gradient: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500",
    pill: "bg-amber-50 text-amber-700",
    ring: "ring-amber-200",
    bar: "bg-amber-500",
    chip: "bg-amber-100 text-amber-800",
  },
  "Platinum Plan": {
    icon: Crown,
    gradient: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600",
    pill: "bg-purple-50 text-purple-700",
    ring: "ring-purple-200",
    bar: "bg-purple-600",
    chip: "bg-purple-100 text-purple-800",
  },
  "Free Plan": {
    icon: Shield,
    gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600",
    pill: "bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-200",
    bar: "bg-emerald-600",
    chip: "bg-emerald-100 text-emerald-800",
  },
  default: {
    icon: Star,
    gradient: "bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-700",
    pill: "bg-gray-50 text-gray-700",
    ring: "ring-gray-200",
    bar: "bg-gray-600",
    chip: "bg-gray-100 text-gray-800",
  },
};

const computeStatus = (args: {
  leads?: number | null;
  ordersCount: number;
  endUpPrice?: number | null;
  earnAmount: number;
  endDate?: string | null;
}) => {
  const { leads, ordersCount, endUpPrice, earnAmount, endDate } = args;
  if (typeof leads === "number" && leads >= 0 && ordersCount >= leads)
    return { expired: true, reason: "Leads limit reached" };
  if (typeof endUpPrice === "number" && endUpPrice >= 0 && earnAmount >= endUpPrice)
    return { expired: true, reason: "Earnings cap reached" };
  if (endDate && new Date(endDate).getTime() < Date.now())
    return { expired: true, reason: "Time validity expired" };
  return { expired: false, reason: "" };
};

const Badge: React.FC<{ label: string; className?: string }> = ({ label, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
    {label}
  </span>
);

const StatChip: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({
  label,
  value,
  className = "",
}) => (
  <div className={`min-w-[160px] rounded-lg border bg-white/60 backdrop-blur p-3 ${className}`}>
    <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
  </div>
);

const Progress: React.FC<{ pct: number; bar: string }> = ({ pct, bar }) => (
  <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
    <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
  </div>
);

const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [sub, setSub] = useState<TechSubResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("userId") || "";
        const plansRes = (await getPlans({})) as PlansResponse;
        setPlans(plansRes?.data ?? []);
        const subRes = (await gettechnicianPlanById(userId)) as TechSubResponse;
        if (subRes?.result) setSub(subRes.result.activePlan);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const plan = useMemo(() => plans.find((p) => p._id === sub?.subscriptionId), [plans, sub]);
  const planName = sub?.subscriptionName ?? plan?.name ?? "—";
  const theme = THEME[planName] ?? THEME.default;

  const endUpPrice = plan?.endUpPrice ?? null;
  const status = computeStatus({
    leads: sub?.leads,
    ordersCount: sub?.ordersCount ?? 0,
    endUpPrice,
    earnAmount: sub?.earnAmount ?? 0,
    endDate: sub?.endDate,
  });

  const dLeft = daysLeft(sub?.endDate ?? null);

  const leadsCap = sub?.leads ?? null;
  const leadsUsed = sub?.ordersCount ?? 0;
  const leadsRemain = typeof leadsCap === "number" ? Math.max(0, leadsCap - leadsUsed) : null;
  const leadsPct = clampPct(leadsUsed, leadsCap ?? undefined);

  const earnUsed = sub?.earnAmount ?? 0;
  const earnCap = endUpPrice ?? null;
  const earnRemain = typeof earnCap === "number" ? Math.max(0, earnCap - earnUsed) : null;
  const earnPct = clampPct(earnUsed, earnCap ?? undefined);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="animate-pulse h-7 w-64 bg-gray-200 rounded" />
        <div className="animate-pulse h-44 w-full bg-gray-100 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />
          <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />
          <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
    }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Subscription</h1>
        <button
          onClick={() => navigate("/technician/plans")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm"
        >
          <Eye className="w-4 h-4" />
          View Plans
        </button>
      </div>

      {sub ? (
        <>
          {/* Hero / Header */}
          <div
            className={`relative overflow-hidden rounded-2xl ${theme.gradient} text-white p-6 md:p-8 shadow-lg ring-1 ${theme.ring}`}
          >
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full opacity-20 blur-3xl bg-white" />
            <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  {React.createElement(theme.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-bold">{planName}</h2>
                    <Badge label={status.expired ? "Expired" : "Active"} className={status.expired ? "bg-white/20" : "bg-white/20"} />
                    {plan?.isPopular && <Badge label="Popular" className="bg-white/25" />}
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatChip label="Start Date" value={new Date(sub.startDate).toLocaleDateString()} />
                    <StatChip label="End Date" value={sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "—"} />
                    <StatChip label="Plan Price" value={plan ? toINR(plan.price) : "—"} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                {status.expired && (
                  <div className="text-sm bg-red-600 rounded-lg px-3 py-1.5 backdrop-blur">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> {status.reason || "Plan expired"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => navigate("/technician/plans")}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold shadow-sm bg-white text-gray-900 hover:bg-gray-100 ${status.expired ? "" : "opacity-90"}`}
                >
                  {status.expired ? "Upgrade / Renew" : "Change Plan"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Progress */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Leads</h3>
                <Badge
                  label={
                    typeof leadsCap === "number"
                      ? `${leadsUsed}/${leadsCap} used`
                      : "Unlimited"
                  }
                  className={theme.chip}
                />
              </div>
              <Progress pct={leadsPct} bar={theme.bar} />
              <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                <span>Used: {leadsUsed}</span>
                <span>
                  Remaining: {typeof leadsRemain === "number" ? leadsRemain : "—"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Earnings towards cap</h3>
                <Badge
                  label={
                    typeof earnCap === "number"
                      ? `${toINR(earnUsed)} / ${toINR(earnCap)}`
                      : `${toINR(earnUsed)} / —`
                  }
                  className={theme.chip}
                />
              </div>
              <Progress pct={earnPct} bar={theme.bar} />
              <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                <span>Earned: {toINR(earnUsed)}</span>
                <span>Remaining: {typeof earnCap === "number" ? toINR(earnRemain ?? 0) : "—"}</span>
              </div>
            </div>
          </div>

          {/* Time validity / status */}
          <div className="rounded-xl border bg-white p-5 mt-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Time Validity</p>
                <p className="font-semibold text-gray-900">
                  {sub.endDate
                    ? dLeft !== null && dLeft <= 0
                      ? "Expired"
                      : `${dLeft} day${dLeft === 1 ? "" : "s"} left`
                    : "No end date (usage-based)"}
                </p>
              </div>
              <Badge
                label={status.expired ? "Expired" : "Active"}
                className={status.expired ? "bg-rose-100 text-rose-700" : theme.chip}
              />
            </div>
          </div>

          {/* Plan details */}
          {plan && (
            <div className="mt-8 grid lg:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Plan Features</h3>
                <div className="space-y-2">
                  {plan.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500" />
                      )}
                      <span className="text-gray-800">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">More Information</h3>
                <div className="space-y-1 text-sm text-gray-800">
                  {plan.fullFeatures?.map((d, i) => (
                    <div key={i}>• {d.text}</div>
                  ))}
                  {typeof plan.leads === "number" && (
                    <div>Leads Included: <span className="font-semibold">{plan.leads}</span></div>
                  )}
                  {typeof plan.endUpPrice === "number" && (
                    <div>Earnings Cap: <span className="font-semibold">{toINR(plan.endUpPrice)}</span></div>
                  )}
                  {typeof plan.gstPercentage === "number" && (
                    <div>GST: <span className="font-semibold">{plan.gstPercentage}%</span></div>
                  )}
                  <div>Final Price (with GST): <span className="font-semibold">{toINR(plan.finalPrice)}</span></div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">No Active Subscription</h3>
              <p className="text-sm text-gray-600">
                Choose a plan to start receiving leads and track your earnings progress.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/technician/plans")}
            className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            View Plans
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;

// import React, { useEffect, useState } from 'react';
// import { Check, X, Star, Crown, Zap, Shield, Eye, EyeIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { getPlans, gettechnicianPlanById } from '../../api/apiMethods'; // Add your API method for current subscription

// const SubscriptionPage = () => {
//   const [plans, setPlans] = useState([]);
//   const [currentSubscription, setCurrentSubscription] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   console.log("plans", plans )
//   console.log("currentSubscription", currentSubscription )
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
        

//         const plansResponse = await getPlans();
//         setPlans(plansResponse?.data || []);
        
//         // Fetch current subscription
//         const subscriptionResponse = await gettechnicianPlanById(userId);
//         if (subscriptionResponse?.result) {
//           console.log("subscriptionResponse?.result", subscriptionResponse?.result)
//           setCurrentSubscription({
//             subscriptionId: subscriptionResponse.result.subscriptionId,
//             name: subscriptionResponse.result.subscriptionName,
//             startDate: subscriptionResponse.result.startDate,
//             endDate: subscriptionResponse.result.endDate,
//             leads: subscriptionResponse.result.leads,
//             ordersCount: subscriptionResponse.result.ordersCount
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getDaysLeft = (endDate) => {
//     if (!endDate) return 0;
//     const diff = new Date(endDate) - new Date();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   const getPlanConfig = (planName) => {
//     const configs = {
//       "Economy Plan": { icon: Zap, color: "blue" },
//       "Gold Plan": { icon: Star, color: "yellow" },
//       "Platinum Plan": { icon: Crown, color: "purple" },
//       "Free Plan": { icon: Shield, color: "green" },
//       // Add more plans as needed
//     };
//     return configs[planName] || { icon: Star, color: "gray" };
//   };

//   if (loading) return <div>Loading...</div>;
// console.log("currentSubscription", currentSubscription.leads)
 

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">My Subscription Plan</h1>
//         <button 
//           onClick={() => navigate('/technician/plans')}
//           className="px-3 py-2 border rounded-lg bg-purple-300 hover:bg-purple-400 flex text-purple-800 font-bold"
//         >
//           <EyeIcon />
//          <span className='ms-1.5'> View All Plans</span>
//         </button>
//       </div>

//       {currentSubscription ? (
//   <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
//     <div className="flex justify-between items-start">
//       <div className="flex items-start gap-5">
//         <div className={`bg-${getPlanConfig(currentSubscription.name).color}-100 p-3 rounded-full mt-1`}>
//           {React.createElement(getPlanConfig(currentSubscription.name).icon, {
//             className: `text-${getPlanConfig(currentSubscription.name).color}-600 text-xl`
//           })}
//         </div>
//         <div className="space-y-2">
//           <h3 className="text-2xl font-bold ">{currentSubscription.name}</h3>
//           <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
//             <div>
//               <p className="text-gray-500">Start Date</p>
//               <p className="font-medium">
//                 {new Date(currentSubscription.startDate).toLocaleDateString()}
//               </p>
//             </div>
//             {currentSubscription?.endDate && (
//             <div>
//               <p className="text-gray-500">End Date</p>
//               <p className="font-medium">
//                 {new Date(currentSubscription.endDate).toLocaleDateString()}
//               </p>
//             </div>
// )}
//             {/* {currentSubscription?.ordersCount && (
//             <div>
//               <p className="text-gray-500">Orders Count</p>
//               <p className="font-medium">{currentSubscription.ordersCount}</p>
//             </div>
//             )} */}
//           </div>
//         </div>

//       </div>
//       <div className="flex flex-col items-end">
//         {currentSubscription?.endDate !== null && (
//         <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//           getDaysLeft(currentSubscription.endDate) <= 0 ? 'bg-red-100 text-red-800' :
//           getDaysLeft(currentSubscription.endDate) <= 3 ? 'bg-red-100 text-red-800' :
//           getDaysLeft(currentSubscription.endDate) <= 7 ? 'bg-yellow-100 text-yellow-800' :
//           'bg-green-100 text-green-800'
//         }`}>
//           {getDaysLeft(currentSubscription.endDate) <= 0 ? 'Expired' : 
//            `${getDaysLeft(currentSubscription.endDate)} days left`}
//         </span>
//         )}
//         {/* {currentSubscription?.leads !== null && (
//           <div className="mt-3 text-right bg-green-100 px-2 py-1 rounded-xl">
//             <p className="text-gray-600 text-sm">Valid Until <span className='text-lg font-bold'>{currentSubscription.leads} </span></p>
//           </div>
//         )} */}
//         {currentSubscription?.leads !== null && (
//           <div className="mt-3 text-right bg-yellow-100 px-2 py-1 rounded-xl">
//             <p className="text-gray-600 text-sm"><span className='text-lg font-bold'>{currentSubscription.leads - currentSubscription.ordersCount}</span> Leads Remaining</p>
//             {/* <p className="font-medium">{currentSubscription.leads - currentSubscription.ordersCount}</p> */}
//           </div>
//         )}
//       </div>
//     </div>
    
//         <hr className='my-6'/>

//         {currentSubscription && plans.length > 0 && (
//   <div className="">
//     <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
//     {plans
//       .filter((plan) => plan._id === currentSubscription.subscriptionId)
//       .map((plan) => {
//         const config = getPlanConfig(plan.name);
//         return (
//           <div key={plan._id} className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
//             <div className="flex items-center mb-4">
//               <div className={`bg-${config.color}-100 text-${config.color}-600 w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
//                 {React.createElement(config.icon, { size: 20 })}
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold">{plan.name}</h3>
//                 <p className="text-md font-medium text-gray-600">₹{plan.price}</p>
//               </div>
//             </div>
//             <div className="space-y-2">
//               {plan.features?.map((feature, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   {feature.included ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
//                   <span className="text-sm">{feature.name}</span>
//                 </div>
//               ))}
//             </div>
//              <div className="space-y-2 mt-3">
//               {plan.fullFeatures?.map((details, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   {/* {details.included ? <Check className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />} */}
//                   <span className="text-sm"><span className='me-3'>•</span>{details?.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//   </div>
// )}

//   </div>
// ):(
//   <div className='bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200 flex-wrap"'>
//     No Subscription Plan. Please choose Suitable plan to grow your technical service business.
//     </div>
// )

// }
     
//     </div>
//   );
// };

// export default SubscriptionPage;

// import React, { useEffect, useState } from 'react';
// import {
//   Check,
//   X,
//   Star,
//   Crown,
//   Zap,
//   Shield,
//   BadgeIndianRupee,
//   LucideIcon,
//   Cross,
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getPlans } from '../../api/apiMethods';

// const iconMap: { [key: string]: LucideIcon } = {
//   Star,
//   Crown,
//   Zap,
//   Shield,
// };

// interface PlanFeature {
//   name: string;
//   included: boolean;
// }

// interface FullFeature {
//   text: string;
// }

// export interface Plan {
//   _id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   gst: number;
//   finalPrice: number;
//   validity: number;
//   validityUnit: string;
//   icon: string;
//   color: string;
//   features: PlanFeature[];
//   fullFeatures: FullFeature[];
//   discount?: number;
//   isPopular?: boolean;
//   buttonColor: string;
// }

// const TechnicianSubscription: React.FC = () => {
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const [plans, setPlans] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPlans = async () => {
//     try {
//       const response = await getPlans();
//       if (response) {
//         setPlans(response?.data);
//       }
//       else {
//       setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//       console.log(err, "==>err");
//     }
//   };
//   useEffect(() => {
//     fetchPlans();
//   }, []);


//   const handleFullDetails = (plan: Plan): void => {
//     navigate(`/subscription/${plan._id}`, { state: { plan } });
//   };

//   interface PlanConfig {
//   gradient: string;       
//   icon: LucideIcon;      
//   button: string;         
// }

// const PLAN_CONFIG: Record<string, PlanConfig> = {
//   "Economy Plan": {
//     gradient: "from-blue-500 to-blue-600",
//     icon: Zap,
//     button: "bg-blue-600 hover:bg-blue-700",
//   },
//   "Gold Plan": {
//     gradient: "from-yellow-400 to-yellow-600",
//     icon: Star,
//     button: "bg-yellow-500 hover:bg-yellow-600",
//   },
//   "Platinum Plan": {
//     gradient: "from-purple-500 to-purple-700",
//     icon: Crown,
//     button: "bg-purple-600 hover:bg-purple-700",
//   },
//   "Free Plan": {
//     gradient: "from-green-400 to-green-600",
//     icon: Shield,
//     button: "bg-green-500 hover:bg-green-700",
//   },
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-14">
//           <h1 className="text-4xl font-extrabold text-gray-800">
//             Technician Subscription Plans
//           </h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3 leading-relaxed">
//             Choose the right plan to grow your technical service business and reach more customers.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {plans.map((plan: Plan) => {
//             const config = PLAN_CONFIG[plan.name] || {
//               gradient: "from-gray-400 to-gray-600",
//               icon: Star,
//               button: "bg-gray-500 hover:bg-gray-600",
//             };
//             const IconComponent = config?.icon;

//             return (
//               <div
//                 key={plan._id}
//                 className={`relative flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border 
//                   ${selectedPlan === plan._id ? 'ring-2 ring-blue-500' : ''} 
//                   ${plan.isPopular ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`}
//               >
//                 {plan.isPopular && (
//                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                     <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//                       MOST POPULAR
//                     </div>
//                   </div>
//                 )}

//                 {Number(plan.discount) > 0 && (
//                   <div className="absolute -top-2 -right-2 z-10">
//                     <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
//                       {plan?.discount}% OFF
//                     </div>
//                   </div>
//                 )}

//                 <div className="p-6 pb-6 flex flex-col h-full">
//                   <div className="text-center mb-6">
//                     <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${config?.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
//                       <IconComponent className="text-white" size={28} />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-800">{plan?.name}</h3>

//                     <div className="mt-2">
//                       <div className="text-2xl font-extrabold text-gray-900">₹ {plan?.price}</div>
//                       {Number(plan.originalPrice) > 0 && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ₹{plan.originalPrice} + (GST 18%)
//                         </div>
//                       )}
//                       {Number(plan.price) > 0 && (
//                       <div className="text-sm text-gray-600">
//                         ₹{plan.price} +  ₹{plan.gst} (GST 18%)
//                         {/* INCL 18% GST: ₹ {plan.price} */}
//                       </div>
//                       )}
//                     </div>

//                     <div className="mt-3 text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
//                       Valid until {plan.validity} {plan.validityUnit}
//                     </div>
//                   </div>

//                   <ul className="space-y-2 mb-6">
//                     {plan.features.map((feature, index) => (
//                       <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
//                         {feature.included ? (
//                           <Check size={16} className="text-green-500" />
//                         ) : (
//                           <X size={16} className="text-red-400" />
//                         )}
//                         {feature.name}
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="mt-auto space-y-3">
//                     <button
//                       onClick={() => setSelectedPlan(plan?.name)}
//                       className={`w-full py-3 px-4 rounded-2xl font-semibold transition duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02]
//                        ${config?.button}`}
//                     >
//                       {selectedPlan === plan?.name ? 'Selected' : 'Choose Plan'}
//                     </button>
//                     <button
//                       onClick={() => handleFullDetails(plan)}
//                       className="w-full py-2 px-4 text-gray-600 hover:text-blue-600 font-medium transition duration-300"
//                     >
//                       Full Details →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TechnicianSubscription;
