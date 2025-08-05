import React from "react";
import OverviewPage from "./_components/Overview";
import Courses from "./_components/Courses";
import Achievements from "./_components/Achievements";
import Recommendation from "./_components/Recommendation";

const WorkSpace = () => {
  return (
    <div>
      <OverviewPage />
      <div className="flex flex-col gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/*  Courses Section */}
          <Courses />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 grid grid-cols-1 lg:grid-cols-2 justify-between gap-24">
          {/* Recent Achievements */}
          <Achievements />

          {/* AI Recommendations */}
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
