//     <Blank className="max-w-[353px] mx-auto space-y-4">
//           <div className="text-xl font-semibold text-default-900">
//             No Task Projects Here
//           </div>
//           <div className="text-default-600 text-sm">
//             There is no task project create. If you create a new task project
//             then click this button & create new board.
//           </div>

//           {session?.user?.department === 'admin' && (
//   loading ? (
//     <Button>
//       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//       Loading ...
//     </Button>
//   ) : (
//     <Button onClick={() => handleCreateProject({ type: "main", data: {} })}>
//       <Plus className="w-4 h-4 mr-1" /> Create Project
//     </Button>
//   )
// )}
//         </Blank>













// <Card className="h-full">
// <CardContent className="h-full flex justify-center items-center">
//   <div className="text-center flex flex-col items-center">
//     <Icon
//       icon="uiw:message"
//       className="text-7xl text-default-300"
//     />
//     <div className="mt-4 text-lg font-medium text-default-500">
//       No sprint selected
//     </div>
//     <p className="mt-1 text-sm font-medium text-default-400">
//       Please select a sprint to view its details
//     </p>
//     {/* Mobile: Show button to open sidebar */}
//     {isDesktop && (
//       <Button
//         variant="outline"
//         onClick={() => setShowSidebar(true)}
//         className="mt-4"
//       >
//         <Menu className="w-4 h-4 mr-2" />
//         Browse Projects
//       </Button>
//     )}
//   </div>
// </CardContent>
// </Card>