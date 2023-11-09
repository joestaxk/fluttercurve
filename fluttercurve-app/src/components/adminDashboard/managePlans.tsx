import useAlert from "../../hooks/alert";
import { ManageCompoundPlans } from "./managePlans/compounding";
import { ManageNormalPlans } from "./managePlans/normal";

export const ManagePlans = function () {
  const { AlertComponent } = useAlert();

  return (
    <div className="w-full md:p-8 p-3">
      <div className="">
        <h2 className="text-3xl mb-2 font-medium text-gray-800">
          Manage Plans
        </h2>
        <p className="text-gray-600">
          Create, Upate, Delete, and Manage plans here.
        </p>
      </div>
      <ManageNormalPlans />
      <ManageCompoundPlans />
      {AlertComponent}
    </div>
  );
};
