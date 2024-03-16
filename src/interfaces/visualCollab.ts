export interface VisualCollab {
  id: number;
  imageLink: string;
  projectId: number;
  suggestion: string;
  status: "To Do";
  createdAt: string;
  updatedAt: string;
  suggestions: CollabSuggestion[]
}

export interface CollabSuggestion{
  id: number,
  collabId: number,
  status: string,
  suggestion: string,
  horizontalPos: number,
  verticalPos: number,
  createdAt: string,
  updatedAt: string,
}
