import helpers from "../../helpers";
import useAlert from "../../hooks/alert";
import auth from "../../lib/auth";
import { userDataStateType } from "../../rState/initialStates";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Transactions({ state }: { state: userDataStateType }) {
  const { AlertComponent, showAlert } = useAlert();
  const [cookies] = useCookies();
  const [transactions, setTransaction] = useState([]);

  useEffect(() => {
    auth
      .getUserTransaction(cookies["xat"])
      .then((res: any) => {
        setTransaction(res.data);
      })
      .catch((err: any) => {
        showAlert("error", err.response.data.description);
      });
  }, []);

  const renderTransactionRow = (transaction: any) => (
    <tr key={transaction.invoiceID} className="odd:bg-gray-50">
      <td className="px-4 py-2 text-center">{transaction.invoiceID}</td>
      <td className="px-4 py-2 text-center">{new Date(transaction.createdAt).toLocaleString()}</td>
      <td className="px-4 py-2 text-center">{transaction.status}</td>
      <td className="px-4 py-2 text-center">{transaction.mode}</td>
      <td className="px-4 py-2 text-center">{transaction.type}</td>
      <td className="px-4 py-2 text-center">
        <span className={`flex w-4 h-4 mr-2 rounded-full`}>
          {transaction.status.toLowerCase() === "successful" ? (
            <svg
              aria-hidden="true"
              fill="none"
              stroke="#4caf50"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          ) : transaction.status.toLowerCase() === "failed" ? (
            <svg
              aria-hidden="true"
              fill="none"
              stroke="red"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          ) : ""}
        </span>
        { helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, transaction.amount), state.currency)}
      </td>
    </tr>
  );

  return (
    <div className="w-full p-4 overflow-scroll">
      <table className="w-full table-auto">
        <thead className="bg-gray-200 rounded-xl">
          <tr>
            <th className="px-4 py-2">Invoice ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Mode</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody className="border rounded-lg">
          {!transactions.length ? (
            <div className="p-4">No Transactions Yet!! </div>
        ) : transactions.map((transaction) => renderTransactionRow(transaction))}
        </tbody>
      </table>
      {AlertComponent}
    </div>
  );
}
