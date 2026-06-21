import { useSubHeader } from "./SubHeaderContext";

const SubHeaderSlot = () => {
    const { subHeader } = useSubHeader();
    if (!subHeader) return null;

    return (
        <div className="sticky top-14 z-40 bg-white border-b border-slate-200 shadow-sm">
            {subHeader}
        </div>
    );
};

export default SubHeaderSlot;