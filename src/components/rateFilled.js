import ChevronUp from "../../public/chevronUp";
import ChevronDown from "../../public/chevronDown";

const RateFilled = ({ change }) => {
  return (
    <div
      className={`${
        Number(change) > 0 ? "bg-green-600" : "bg-red-600"
      } flex items-center px-3 ml-3 rounded-xl`}
    >
      {Number(change) > 0 ? <ChevronUp /> : <ChevronDown />}

      <small className="pl-1 text-white font-medium font-montserrat text-sm">
        {Number(change).toFixed(2).toString()}%
      </small>
    </div>
  );
};

export default RateFilled;
