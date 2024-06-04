export enum GridEnums {
    Ideas = 'f3c1bf72-15fd-4dcd-904c-b67850525cff',
    Tickets = '787a2afc-26df-440a-9040-9a3e5c5333d5',
    Users = '4ea9fe5d-0af3-4102-af95-4d4a5ca886e1',
    Tenants = 'b543fc1d-6f45-469e-87ae-2b18b8200955',
    Roles = '9af2eebb-7687-4b3c-91fa-607efb0a5fea',
    Inquiry = 'ac0b9a3a-d113-4590-93db-dea62bcb89a2',
    Groups = 'c599b6ff-fee3-4ade-bf78-16700fddb5b9'
  }
  
  export enum GridStateTypeEnums {
    Column = 1,
    Pivot_Mode = 2,
    Column_Sort = 3,
    Column_Filter = 4,
    Column_Group = 5
  }
  
  export enum MenuTypeEnums {
    Left_Menu = 1,
    Application_Menu = 2,
    Builders_Menu = 3,
    Favorites_Menu = 4
  }
  
  export enum VerticalEnums {
    Engage = 1,
    Manage = 2,
    Build = 3,
    Play = 4
  }
  
  export enum MenuItemEnums {
    Container = 'b36cec3c-fe05-47ed-a687-70be22b0e200',
    External_Link = '11758dfd-ac3a-4996-b86c-767947776ff8',
    Data_Browser = 'afc3833e-e288-4cf6-8155-a069ec4ddc5a',
    Report = '22763e92-2477-43c3-92db-124a84e5ff7f',
    Page = 'd506aeef-ba1b-49a8-9032-beba450b11bc',
    Page_Builder = '16df758b-c456-4c8c-8ca3-2ae167b3b078',
    Route = 'ec5f1c26-e7e1-4f19-8e6e-143308995a40',
    Tree_Builder = 'd4379c4f-6496-4caa-bc0d-5f297fea580f',
    Inquiry = 'b45f660f-a172-4444-8dd8-8f51d56e0725',
    Scheduler = '4007feb9-e50c-44f9-8502-a1f337d82bcf',
    Config = 'aeb48be9-09ea-49b3-9f21-486fe3545b2d',
    Action = 'a66e9458-2540-4166-9b26-1e9b44a2b080',
    Inner_Menu = 'c4f7b46c-00b8-428e-b982-1639c03fde20'
  }
  
  export enum ADUserTypeEnums {
    Guest = 'Guest',
    Member = 'Member'
  }
  
  export enum ProductEnums {
    Unity = 1
  }
  
  export enum RoleTypeEnums {
    System = 1,
    Tenant = 2
  }
  
  export enum LookupTypeEnums {
    No_Lookup = 'NO_LOOKUP',
    Api = 'API',
    Csv = 'CSV',
    Domain = 'DOMAIN',
    Lookup = 'LOOKUP'
  }
  
  export enum SearchValueType {
    String = 'String',
    Int = 'Int',
    Long = 'Long',
    Double = 'Double',
    Boolean = 'Boolean',
    DateTime = 'DateTime'
  }
  
  export enum SearchGroupingType {
    Distinct = 'DISTINCT',
    Aggregate = 'AGGREGATE'
  }
  
  export enum SearchSortDirection {
    Asc = 'ASC',
    Desc = 'DESC'
  }
  
  export enum RoleNameEnums {
    System_Administrator = 'System Administrator',
    Company_Administrator = 'Company Administrator',
    Developer = 'Developer'
  }
  
  export enum ProductNameEnums {
    Asset_Management = 'Asset Management',
    Asset_Routing = 'Asset Routing',
    AVI = 'AVI',
    Cashiering = 'Cashiering',
    Citizen_Portal = 'Citizen Portal',
    Compliance = 'Compliance',
    Consumer_Engagement = 'Consumer Engagement',
    Consumer_Information = 'Consumer Information',
    Contact_Center = 'Contact Center',
    Course_Management = 'Course Management',
    Crew_Routing = 'Crew Routing',
    Dispatch = 'Dispatch',
    Dispatch_Admin = 'Dispatch Admin',
    Employee_Network = 'Employee Network',
    Energy_Management = 'Energy Management',
    Equipment_Inspection = 'Equipment Inspection',
    Facility_Management = 'Facility Management',
    Field_Mobility = 'Field Mobility',
    Fixed_Assets = 'Fixed Assets',
    Fleet_Management = 'Fleet Management',
    Health_And_Safety = 'Health & Safety',
    Instructor_Application = 'Instructor Application',
    MDM = 'MDM',
    Member_Management = 'Member Management',
    Page_Builder = 'Page Builder',
    Project_Management = 'Project Management',
    Rentals = 'Rentals',
    Unity = 'Unity',
    Work_Orders = 'Work Orders'
  }
  
  export enum LogicalSearchOperatorEnums {
    And = 1,
    Or = 2
  }
  
  export enum NodeActionTriggerEnums {
    On_Node_Drop = 1
  }
  
  export enum NodeActionEnums {
    Load_Inquiry_Page = 1,
    Execute_Api = 2,
    Start_Workflow = 3,
    Create = 4,
    Update = 5,
    Delete = 6,
    Retrieve = 7,
    Open_Inquiry = 8,
    Open_Maintenance_Engine = 9,
    Redirect = 10,
    Open_External_Link = 11,
    Hide = 12,
    Disable = 13,
    Open_Page_Split_Screen = 14,
    Open_Shell_Split_Screen = 15,
    Open_Notes = 16
  }
  
  export enum TreeViewModeEnums {
    Classic = 1,
    Compact = 2
  }
  
  export enum PanelPositionEnums {
    Site_Header = 1,
    Site_Header_Summary = 2,
    Speed_Dial = 3,
    Inquiry_Header = 4,
    Inquiry_Header_Summary = 5
  }
  
  export enum CardinalityTypeEnums {
    One_To_One = 0,
    One_To_Many = 1,
    Many_To_Many = 2,
    Many_To_One = 3
  }
  
  export enum SplitScreenTypeEnums {
    Entity = 1,
    Notes = 2,
    Page = 3
  }
  
  export enum UdpEnums {
    Udp_Note_Type = 'UdpNoteType',
    Udp_Note_Template = 'UdpNoteTemplate',
    Udp_Note = 'UdpNote',
    Udp_Note_Filed_For = 'UdpNoteFiledFor',
    Udp_Shortcut_Content = 'UdpShortcutContent',
    Udp_Lookup = 'UdpLookup'
  }
  
  export enum NodeGroupTypeEnums {
    Static = 'static',
    Dynamic = 'dynamic'
  }
  
  export enum NodeGroupOutlierEnums {
    Hide = 'hide',
    Group = 'group',
    Individual = 'individual'
  }
  
  export enum LookupTypeIdEnums {
    Api = 1,
    Csv = 2,
    Domain = 3,
    Lookup = 4
  }
  
  export enum VisibilityTypeEnums {
    Private = 1,
    Public = 2,
  }