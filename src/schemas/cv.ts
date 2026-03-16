import { Schema } from "effect";

//<editor-fold desc="CountryCode">
export const CountryCodeSchema = Schema.String.pipe(
  Schema.length(2),
  Schema.uppercased(),
).annotations({
  identifier: "CountryCode",
  title: "countryCode",
  description: "The ISO 3166-1 alpha-2 code for the country",
});
//</editor-fold>

//<editor-fold desc="Location">
export const LocationSchema = Schema.Struct({
  city: Schema.NonEmptyString.annotations({
    identifier: "City",
    title: "city",
    description: "The city of this location",
  }),
  region: Schema.optional(Schema.NonEmptyString).annotations({
    identifier: "Region",
    title: "region",
    description: "The region of this location",
  }),
  country: CountryCodeSchema.annotations({
    identifier: "Country",
    title: "country",
    description: "The ISO 3166-1 alpha-2 code for the country of this location",
  }),
});
export type LocationType = typeof LocationSchema.Type;
//</editor-fold>

//<editor-fold desc="LanguageCode">
export const LanguageCodeSchema = Schema.Union(
  Schema.String.pipe(Schema.length(2), Schema.lowercased()),
  Schema.TemplateLiteral(
    Schema.String.pipe(Schema.length(2), Schema.lowercased()),
    Schema.Literal("-"),
    Schema.String.pipe(Schema.length(2), Schema.uppercased()),
  ),
).annotations({
  identifier: "LanguageCode",
  title: "languageCode",
  description:
    "The ISO 639-1 code for the language that may be followed by the ISO 3166-1 alpha-2 code for a country",
});
//</editor-fold>

//<editor-fold desc="Language">
export const LanguageSimpleSchema = LanguageCodeSchema.annotations({
  identifier: "LanguageSimple",
  title: "languageSimple",
});
export const LanguageDetailedSchema = Schema.Struct({
  code: LanguageCodeSchema,
  level: Schema.Number.pipe(Schema.between(0, 5)),
}).annotations({
  identifier: "LanguageDetailed",
  title: "languageDetailed",
});
export const LanguageSchema = Schema.Union(
  LanguageSimpleSchema,
  LanguageDetailedSchema,
).annotations({
  identifier: "Language",
  title: "language",
});
//</editor-fold>

//<editor-fold desc="Company">
export const CompanySchema = Schema.Struct({
  name: Schema.NonEmptyString.annotations({
    identifier: "Name",
    title: "name",
    description: "The name of the company",
  }),
  description: Schema.optional(Schema.NonEmptyString).annotations({
    identifier: "Description",
    title: "description",
    description:
      "The description of the company explaining briefly its line of business",
  }),
  url: Schema.optional(Schema.Union(Schema.URL, Schema.String)).annotations({
    identifier: "Url",
    title: "url",
    description: "The URL of the company's website",
  }),
  location: Schema.optional(LocationSchema).annotations({
    identifier: "Location",
    title: "location",
    description:
      "The location of the company where this company is based (not necessarily where the person works)",
  }),
}).annotations({
  identifier: "Company",
  title: "company",
  description: "A company involved in a person's career or education",
});
//</editor-fold>

//<editor-fold desc="Technology">
export const TechnologySimpleSchema = Schema.NonEmptyString.annotations({
  identifier: "TechnologySimple",
  title: "technologySimple",
  description:
    "A simple string of the name of a technology used in a person's career or education",
});
export const TechnologyDetailedSchema = Schema.Struct({
  name: Schema.NonEmptyString.annotations({
    identifier: "Name",
    title: "name",
    description: "The name of the technology",
  }),
  level: Schema.Number.pipe(Schema.between(0, 5)).annotations({
    identifier: "Level",
    title: "level",
    description:
      "The level of expertise in the technology on a scale from 0 to 5",
  }),
}).annotations({
  identifier: "TechnologyDetailed",
  title: "technologyDetailed",
  description:
    "A detailed description of a technology used in a person's career or education",
});
export const TechnologySchema = Schema.Union(
  TechnologySimpleSchema,
  TechnologyDetailedSchema,
).annotations({
  identifier: "Technology",
  title: "technology",
  description: "A technology used in a person's career or education",
});
//</editor-fold>

//<editor-fold desc="Skill">
export const SkillSimpleSchema = Schema.NonEmptyString.annotations({
  identifier: "SkillSimple",
  title: "skillSimple",
  description:
    "A simple string of the name of a skill acquired or employed in a person's career or education",
});
export const SkillDetailedSchema = Schema.Struct({
  name: Schema.NonEmptyString.annotations({
    identifier: "Name",
    title: "name",
    description: "The name of the skill",
  }),
  level: Schema.Number.pipe(Schema.between(0, 5)).annotations({
    identifier: "Level",
    title: "level",
    description: "The level of expertise in the skill on a scale from 0 to 5",
  }),
});
export const SkillSchema = Schema.Union(
  SkillSimpleSchema,
  SkillDetailedSchema,
).annotations({
  identifier: "Skill",
  title: "skill",
  description: "A skill acquired or employed in a person's career or education",
});
//</editor-fold>

//<editor-fold desc="Project">
export const ProjectSchema = Schema.Struct({
  company: Schema.optional(CompanySchema).annotations({
    identifier: "Company",
    title: "company",
    description:
      "The company where the project is carried out (may be empty if obvious from the nesting)",
  }),

  name: Schema.NonEmptyString.annotations({
    identifier: "Name",
    title: "name",
    description: "The name of the project",
  }),
  description: Schema.optional(Schema.NonEmptyString).annotations({
    identifier: "Description",
    title: "description",
    description: "The description of the project",
  }),

  technologies: Schema.optional(
    Schema.NonEmptyArray(TechnologySchema),
  ).annotations({
    identifier: "Technologies",
    title: "technologies",
    description: "The technologies used in the project",
  }),
  skills: Schema.optional(Schema.NonEmptyArray(SkillSchema)).annotations({
    identifier: "Skills",
    title: "skills",
    description: "The skills acquired or employed in the project",
  }),

  responsibilities: Schema.optional(
    Schema.NonEmptyArray(Schema.NonEmptyString),
  ).annotations({
    identifier: "Responsibilities",
    title: "responsibilities",
    description: "The responsibilities of the person in the project",
  }),
  achievements: Schema.optional(
    Schema.Array(Schema.NonEmptyString),
  ).annotations({
    identifier: "Achievements",
    title: "achievements",
    description: "The achievements earned in the project",
  }),
});
//</editor-fold>

//<editor-fold desc="Job">
const jobFields = {
  name: Schema.NonEmptyString.annotations({
    identifier: "Position",
    title: "position",
    description: "The position held at the company",
  }),
  description: Schema.optional(Schema.NonEmptyString).annotations({
    identifier: "Description",
    title: "description",
    description: "The description of the job",
  }),
  location: Schema.optional(LocationSchema).annotations({
    identifier: "Location",
    title: "location",
    description: "The location of the job",
  }),

  startDate: Schema.DateFromString.annotations({
    identifier: "StartDate",
    title: "startDate",
    description: "The start date of the job",
  }),
  endDate: Schema.optional(Schema.DateFromString).annotations({
    identifier: "EndDate",
    title: "endDate",
    description: "The end date of the job",
  }),

  technologies: Schema.optional(
    Schema.NonEmptyArray(TechnologySchema),
  ).annotations({
    identifier: "Technologies",
    title: "technologies",
    description: "The technologies used in the job",
  }),
  skills: Schema.optional(Schema.NonEmptyArray(SkillSchema)).annotations({
    identifier: "Skills",
    title: "skills",
    description: "The skills acquired or employed in the job",
  }),

  responsibilities: Schema.optional(
    Schema.NonEmptyArray(Schema.NonEmptyString),
  ).annotations({
    identifier: "Responsibilities",
    title: "responsibilities",
    description: "The responsibilities of the person in the job",
  }),
  achievements: Schema.optional(
    Schema.Array(Schema.NonEmptyString),
  ).annotations({
    identifier: "Achievements",
    title: "achievements",
    description: "The achievements earned in the job",
  }),

  projects: Schema.optional(Schema.NonEmptyArray(ProjectSchema)).annotations({
    identifier: "Projects",
    title: "projects",
    description: "The projects carried out in the job",
  }),
};

interface PositionEncoded extends Schema.Struct.Encoded<typeof jobFields> {
  readonly previousPositions?:
    | Readonly<[PositionEncoded, ...Array<PositionEncoded>]>
    | undefined;
}

export class PositionSchema extends Schema.Class<PositionSchema>("Position")({
  ...jobFields,

  previousPositions: Schema.optional(
    Schema.NonEmptyArray(
      Schema.suspend(
        (): Schema.Schema<PositionSchema, PositionEncoded> => PositionSchema,
      ),
    ),
  ).annotations({
    identifier: "PreviousPositions",
    title: "previousPositions",
    description: "The previous positions held at the company",
  }),
}) {}

export class JobSchema extends Schema.Class<JobSchema>("Job")({
  company: CompanySchema.annotations({
    identifier: "company",
    title: "company",
    description: "the company where this job takes place",
  }),

  ...jobFields,

  previousPositions: Schema.optional(
    Schema.NonEmptyArray(PositionSchema),
  ).annotations({
    identifier: "PreviousPositions",
    title: "previousPositions",
    description: "The previous positions held at the company",
  }),
}) {}
//</editor-fold>

export const CvSchema = Schema.Struct({
  name: Schema.NonEmptyString.annotations({
    identifier: "Name",
    title: "name",
    description: "The name of the person",
  }),
  headline: Schema.optional(Schema.NonEmptyString).annotations({
    identifier: "Headline",
    title: "headline",
    description: "The headline of the person",
  }),
  summary: Schema.optional(
    Schema.Union(
      Schema.NonEmptyString,
      Schema.NonEmptyArray(Schema.NonEmptyString),
    ),
  ).annotations({
    identifier: "Summary",
    title: "summary",
    description:
      "A brief summary of the person's career or education (when this is an array, each entry is a paragraph)",
  }),

  citizenship: Schema.optional(
    Schema.NonEmptyArray(CountryCodeSchema),
  ).annotations({
    identifier: "Citizenship",
    title: "citizenship",
    description: "The countries of citizenship of the person",
  }),

  location: Schema.optional(LocationSchema).annotations({
    identifier: "Location",
    title: "location",
    description: "The location of the person whose CV belongs to",
  }),

  languages: Schema.optional(Schema.NonEmptyArray(LanguageSchema)).annotations({
    identifier: "Languages",
    title: "languages",
    description: "The languages spoken by the person",
  }),

  skills: Schema.optional(Schema.NonEmptyArray(SkillSchema)).annotations({
    identifier: "Skills",
    title: "skills",
    description:
      "The skills acquired or employed in the person's career or education",
  }),
  technologies: Schema.optional(
    Schema.NonEmptyArray(TechnologySchema),
  ).annotations({
    identifier: "Technologies",
    title: "technologies",
    description: "The technologies used in the person's career or education",
  }),

  jobs: Schema.optional(Schema.NonEmptyArray(JobSchema)).annotations({
    identifier: "Jobs",
    title: "jobs",
    description: "The jobs held by the person",
  }),
}).annotations({
  identifier: "CV",
  title: "cv",
  description: "A curriculum vitae of a person",
});
export type CvEncodedType = typeof CvSchema.Encoded;
export type CvType = typeof CvSchema.Type;
