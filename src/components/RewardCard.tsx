// export default function RewardCard({ reward, userId }: any) {
//   const locked = reward.cost > 0;

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
//       <div className="mb-4 text-center text-3xl">🎁</div>

//       <h3 className="font-semibold text-center mb-2">
//         {reward.title}
//       </h3>

//       <p className="text-sm text-gray-500 text-center mb-4">
//         ⭐ {reward.cost} pts
//       </p>

//       <button
//         disabled={locked}
//         className={`mt-auto py-2 rounded-full text-sm font-medium
//           ${locked
//             ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//             : 'bg-purple-600 text-white hover:bg-purple-700'}
//         `}
//       >
//         {locked ? 'Locked' : 'Claim'}
//       </button>
//     </div>
//   );
// }
