import BreadCrumbs from "./bread-crumbs";
import Dummy from "./components/dummy";

const DummyPage = async () => {
  return (
    <>
      <div className="flex flex-wrap mb-7">
        <div className="text-xl font-medium text-default-900 flex-1">
          Dummy Page
        </div>
        <div className="flex-none">
          <BreadCrumbs />
        </div>
      </div>
      <Dummy/>
    </>
  );
};

export default DummyPage;
