import React from "react";
import WorkSpaceProvider from "./provider";

const WorkspaceLayout = ({ children }: any) => {
  return <WorkSpaceProvider>{children}</WorkSpaceProvider>;
};

export default WorkspaceLayout;
