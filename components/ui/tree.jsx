import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Minus, Circle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatLabel = (label) => {
  if (label.toLowerCase() === 'daily task') {
    return label
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return label;
};

const TreeNode = ({
  node,
  onCheck,
  onExpand,
  onSelect,
  expandedKeys,
  checkable,
  endContent,
  className,
  showLine,
  selectedKeys,
  isRootNode = false,
  onAddClick,
}) => {
  const { id, label, children, checked, icon, type, font } = node;
  const [isChecked, setIsChecked] = useState(checked || false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const hasChildren = children && children.length > 0;
  const isExpanded = expandedKeys.includes(id);
  const isSelected = selectedKeys?.includes(id);

  // Recursively check if any child is selected
  const hasSelectedDescendant = (node) => {
    if (!node.children) return false;
    return node.children.some(
      (child) =>
        selectedKeys?.includes(child.id) || hasSelectedDescendant(child)
    );
  };

  const shouldHighlightGroup = isRootNode && (isSelected || hasSelectedDescendant(node));

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  useEffect(() => {
    const someChecked = children?.some((child) => child.checked);
    const allChecked = children?.every((child) => child.checked);
    setIsIndeterminate(someChecked && !allChecked);
  }, [children]);

  const handleExpand = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onExpand(id);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if ((type === "item" || type === "folder") && onSelect) {
      onSelect(node);
    }
  };

  const handleCheck = (e) => {
    e.stopPropagation();
    const updatedChecked = !isChecked;
    setIsChecked(updatedChecked);
    setIsIndeterminate(false);
    onCheck(id, updatedChecked);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddClick) {
      onAddClick(node);
    }
  };

  return (
    <div className={cn("relative", isRootNode && "mb-0.5")}>
      <div className="flex items-center group">
        <div
          onClick={hasChildren ? handleExpand : handleSelect}
          className={cn(
            "flex justify-between items-center py-1 px-3 gap-1.5 w-full rounded-md cursor-pointer transition-colors duration-200",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            shouldHighlightGroup && [
              "bg-blue-50 dark:bg-blue-900/20",
              "border-l-2 border-blue-400 pl-2"
            ],
            isSelected && [
              "bg-blue-100 dark:bg-blue-900/30",
              "border-l-2 border-blue-500 pl-2",
              "text-blue-700 dark:text-blue-300"
            ],
            className
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Icon */}
            <span className="[&>svg]:w-4 [&>svg]:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0">
              {icon}
            </span>
            
            {/* Label */}
            <span
              className={cn(
                "text-sm font-medium leading-tight truncate transition-colors",
                font,
                {
                  "text-blue-700 dark:text-blue-300": isSelected,
                  "text-gray-700 dark:text-gray-200": !isSelected,
                }
              )}
            >
             {formatLabel(label)}
            </span>

            {/* Badge */}
            {node.badge > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 ml-auto"
              >
                {node.badge}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Add button */}
            {isRootNode && type === "folder" && (
              <button
                onClick={handleAddClick}
                className={cn(
                  "p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100",
                  "hover:bg-green-100 dark:hover:bg-green-900/30",
                  "text-green-600 dark:text-green-400",
                  "hover:scale-105"
                )}
                title="Add File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* Expand arrow */}
            {hasChildren && (
              <span
                onClick={handleExpand}
                className={cn(
                  "transition-transform duration-200 cursor-pointer p-1 rounded-md",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "text-gray-400 dark:text-gray-500",
                  {
                    "rotate-90": isExpanded,
                  }
                )}
              >
                {endContent}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ScrollArea className="h-[40%]">
        <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-1 mt-0.5">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onCheck={onCheck}
              onExpand={onExpand}
              onSelect={onSelect}
              expandedKeys={expandedKeys}
              checkable={checkable}
              endContent={endContent}
              className={className}
              showLine={showLine}
              selectedKeys={selectedKeys}
              onAddClick={onAddClick}
            />
          ))}
        </div>
        </ScrollArea>
      )}
    </div>
  );
};

const Tree = ({
  data = [],
  onSelect,
  defaultExpandedKeys = [],
  defaultSelectedKeys = [],
  defaultCheckedKeys = [],
  onCheck,
  checkable = false,
  endContent = <ChevronRight className="w-3.5 h-3.5" />,
  className,
  showLine = false,
  setGroupId,
  setShowCreateProject,
  setGroupClicked
}) => {
  const [treeData, setTreeData] = useState(data);
  const [expandedKeys, setExpandedKeys] = useState(defaultExpandedKeys);
  const [selectedKeys, setSelectedKeys] = useState(defaultSelectedKeys);

  useEffect(() => {
    setTreeData(data);
  }, [data]);

  const handleCheck = (nodeId) => {
    const updatedData = toggleNodeChecked(treeData, nodeId);
    setTreeData(updatedData);
    if (onCheck) {
      onCheck(updatedData);
    }
  };

  const toggleNodeChecked = (nodes, nodeId) => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, checked: !node.checked };
        if (updatedNode.children) {
          updatedNode.children = toggleAllChildren(
            updatedNode.children,
            updatedNode.checked
          );
        }
        return updatedNode;
      } else if (node.children) {
        const updatedChildren = toggleNodeChecked(node.children, nodeId);
        const allChecked = updatedChildren.every((child) => child.checked);
        const someChecked = updatedChildren.some((child) => child.checked);

        return {
          ...node,
          children: updatedChildren,
          checked: allChecked ? true : someChecked ? null : false,
        };
      }
      return node;
    });
  };

  const toggleAllChildren = (children, checked) => {
    return children.map((child) => ({
      ...child,
      checked,
      children: child.children
        ? toggleAllChildren(child.children, checked)
        : null,
    }));
  };

  const handleExpand = (nodeId) => {
    setExpandedKeys((prevExpandedKeys) =>
      prevExpandedKeys.includes(nodeId)
        ? prevExpandedKeys.filter((key) => key !== nodeId)
        : [...prevExpandedKeys, nodeId]
    );
  };

  const handleSelect = (selectedNode) => {
    setSelectedKeys([selectedNode.id]);
    if (onSelect) {
      onSelect(selectedNode);
    }
  };

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onCheck={handleCheck}
          onExpand={handleExpand}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          checkable={checkable}
          endContent={endContent}
          className={className}
          showLine={showLine}
          selectedKeys={selectedKeys}
          isRootNode={true}
          onAddClick={(folderNode) => {
            setShowCreateProject(true);
            setGroupClicked(folderNode);
            setGroupId(folderNode.id);
          }}
        />
      ))}
    </div>
  );
};

export { Tree };
