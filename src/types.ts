// @ts-ignore
import EditorJS, { type I18nConfig, type LogLevels, type ToolConstructable, type ToolSettings } from '@editorjs/editorjs'

export interface GlobalEditorJs {
   autofocus?: boolean;
   defaultBlock?: string;
   placeholder?: string|false;
   minHeight?: number;
   logLevel?: LogLevels;
   i18n?: I18nConfig;
   inlineToolbar?: string[]|boolean;
   tunes?: string[];
}

export interface ApiImageToolOptions {
    methods: string,
    basePath: string,
    imageDir: string,
    mime: string[],
    maxFileSize: number,
}
export interface ApiLinkToolOptions {
    basePath: string,
}
export interface ApiAttachesToolOptions {
    basePath: string,
    imageDir: string,
    mime: string[],
    maxFileSize: number,
}
export interface ApiPersonalityToolOptions {
    basePath: string,
    imageDir: string,
    mime: string[],
    maxFileSize: number,
}

export interface OnReadyFunc {
  onReady?(): void;
}
export interface HeaderConfig {
  header?: any;
}

export interface NestedListConfig {
  nestedlist: {
    class?: any;
    inlineToolbar: boolean;
    config: {
      defaultStyle: string;
    };
  };
}

export interface ImageConfig {
  image: {
    class?: any;
    config: {
      uploader?: {
        uploadByFile(file: File): Promise<{ success: number; file: { url: string } }>;
        uploadByUrl(url: string): Promise<{ success: number; file: { url: string } }>;
      };
      endpoints?: {
        byFile?: string; // Your backend file uploader endpoint
        byUrl?: string; // Your endpoint that provides uploading by Url
      };
    };
  };
}

export interface ChecklistConfig {
  checklist: {
    class?: any;
    inlineToolbar: boolean;
  };
}

export interface LinkToolConfig {
  linkTool: {
    class?: any;
    config: {
      endpoint?: string;
    };
  };
}

export interface RawConfig {
  raw?: any;
}

export interface EmbedConfig {
  embed?: any;
}

export interface QuoteConfig {
  quote: {
    class?: any;
    inlineToolbar: boolean;
    shortcut: string;
    config: {
      quotePlaceholder: string;
      captionPlaceholder: string;
    };
  };
}

export interface ParagraphConfig {
  paragraph: {
    class?: any;
    inlineToolbar: boolean;
  };
}

export interface TableConfig {
  table: {
    class?: any;
    inlineToolbar: boolean;
    config: {
      rows: number;
      cols: number;
    };
  };
}

export interface AttachesConfig {
  attaches: {
    class?: any;
    config: {
      endpoint?: string;
      uploader?: {
        uploadByFile(file: File): Promise<{ success: number; file: { url: string } }>;
      };
    };
  };
}

export interface DelimiterConfig {
  delimiter?: any;
}

export interface MarkerConfig {
  Marker: {
    class?: any;
    shortcut: string;
  };
}

export interface ColorConfig {
  Color: {
    class?: any;
    config: {
      colorCollections: string[];
      defaultColor: string;
      type: string;
      customPicker: boolean;
    };
  };
}

export interface ChangeCaseConfig {
  changeCase: {
    class?: any;
    config: {
      showLocaleOption: boolean;
      locale: string | string[];
    };
  };
}

export interface HyperlinkConfig {
  hyperlink: {
    class?: any;
    config: {
      shortcut: string;
      target: string;
      rel: string;
      availableTargets: string[];
      availableRels: string[];
      validate: boolean;
    };
  };
}

export interface TextVariantConfig {
  textVariant?: any;
}

export interface CodeConfig {
  code?: any;
}

export interface TextAlignConfig {
  textAlign?: any;
}

export interface PersonalityConfig {
  personality: {
    class?: any;
    config: {
      endpoint?: string;
    };
  };
}

export interface WarningConfig {
  warning: {
    class?: any;
    inlineToolbar: boolean;
    shortcut: string;
    config: {
      titlePlaceholder: string;
      messagePlaceholder: string;
    };
  };
}

export interface InlineCodeConfig {
  inlineCode: {
    class?: any;
    shortcut: string;
  };
}

export interface UndoConfig {
  undo: string;
  redo: string;
}

export interface AlligmentConfig {
  alligment : {
    class ?: any,
    config : {
      default : string,
    }
  },
}

export interface ColumnsConfig {
  columns : {
    class ?: any,
    config ?: {
      EditorJsLibrary ?: EditorJS, // Pass the library instance to the columns instance.
      tools ?: Record<string, ToolConstructable | ToolSettings> // IMPORTANT! ref the column_tools
    }
  },
}

export interface ApiModuleOptions {
  ImageTool: Partial<ApiImageToolOptions>,
  LinkTool: Partial<ApiLinkToolOptions>,
  AttachesTool: Partial<ApiAttachesToolOptions>,
  PersonalityTool: Partial<ApiPersonalityToolOptions>,
}

export interface EditorJsToolsConfig {
  HeaderConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<HeaderConfig>;
  },
  NestedListConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<NestedListConfig>;
  };
  ImageConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<ImageConfig>;
  };
  ChecklistConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<ChecklistConfig>;
  };
  LinkToolConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<LinkToolConfig>;
  };
  RawConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<RawConfig>;
  };
  EmbedConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<EmbedConfig>;
  };
  QuoteConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<QuoteConfig>;
  };
  ParagraphConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<ParagraphConfig>;
  };
  TableConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<TableConfig>;
  };
  AttachesConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<AttachesConfig>;
  };
  DelimiterConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<DelimiterConfig>;
  };
  MarkerConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<MarkerConfig>;
  };
  ColorConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<ColorConfig>;
  };
  ChangeCaseConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<ChangeCaseConfig>;
  };
  HyperlinkConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<HyperlinkConfig>;
  };
  TextVariantConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<TextVariantConfig>;
  };
  CodeConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<CodeConfig>;
  };
  PersonalityConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<PersonalityConfig>;
  };
  WarningConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<WarningConfig>;
  };
  InlineCodeConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<InlineCodeConfig>;
  };
  UndoConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig: Partial<UndoConfig>;
  };
  DragDropConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
  };
  ColumnsConfig?: {
    isEnabled: boolean;
    toolsConfig?: Partial<ColumnsConfig>;
  };
  AlignmentTuneToolConfig?: {
    isEnabled: boolean;
    toolsConfig?: Partial<AlligmentConfig>;
  };
  TextAlignConfig?: {
    isEnabled: boolean;
    supportInColumn: boolean;
    toolsConfig?: Partial<TextAlignConfig>;
  };
}

export interface ModuleOptions {
  EditorJsConfig: Partial<GlobalEditorJs>,
  EditorJsToolsConfig: Partial<EditorJsToolsConfig>
  Api: Partial<ApiModuleOptions>
}

export interface ModuleOptionsConfig {
  EditorJsConfig: GlobalEditorJs,
  EditorJsToolsConfig: EditorJsToolsConfig
  Api: ApiModuleOptions
}
