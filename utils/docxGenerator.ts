import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, Header, Footer } from 'docx';
import FileSaver from 'file-saver';
import { FicheData } from '../types';

export const generateDocx = async (data: FicheData) => {
  const primaryColor = "0EA5E9"; // Sky 500

  // Helper to create list items
  const createBulletList = (items: string[]) => {
    if (!items || items.length === 0) return [new Paragraph({ text: "Aucun élément", style: "Normal" })];
    return items.map(item => 
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        style: "Normal",
      })
    );
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22, // 11pt
          },
          paragraph: {
            spacing: { line: 276 }, // 1.15 spacing
          },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Calibri",
            size: 32, // 16pt
            bold: true,
            color: "000000",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, before: 120 },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Calibri",
            size: 28, // 14pt
            bold: true,
            color: primaryColor,
          },
          paragraph: {
            spacing: { after: 120, before: 240 },
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Calibri",
            size: 24, // 12pt
            bold: true,
            color: "000000",
          },
          paragraph: {
            spacing: { after: 100, before: 200 },
          },
        },
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Calibri",
            size: 22, // 11pt
          },
          paragraph: {
             spacing: { after: 100 },
          }
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 20mm in twips
              right: 1134,
              bottom: 1134,
              left: 1134,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Généré par EPS Hub | Source: Orientation Pédagogique EPS 2007/2009 (Maroc) | Date: ${new Date().toLocaleDateString('fr-FR')}`,
                    size: 18, // 9pt
                    color: "888888"
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header: Title
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
          }),

          // Metadata Line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Niveau : ", bold: true }),
              new TextRun({ text: data.grade }),
              new TextRun({ text: " • Sport : ", bold: true }),
              new TextRun({ text: data.sport }),
              new TextRun({ text: " • Durée : ", bold: true }),
              new TextRun({ text: data.durationTotal }),
            ],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, space: 10, color: "CCCCCC" }
            },
            spacing: { after: 300 }
          }),

          // Compétence(s) visée(s) (APC)
          new Paragraph({
            text: "Compétence(s) visée(s)",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createBulletList(data.competences),

          // Objectifs Pédagogiques
          new Paragraph({
            text: "Objectifs pédagogiques",
            heading: HeadingLevel.HEADING_2,
          }),
          ...createBulletList(data.objectives),

          // Matériel & Sécurité Grid
           new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ text: "Matériel", heading: HeadingLevel.HEADING_2 }),
                                ...createBulletList(data.materials)
                            ],
                        }),
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ text: "Consignes de sécurité", heading: HeadingLevel.HEADING_2 }),
                                ...createBulletList(data.safety)
                            ],
                        }),
                    ],
                }),
            ],
          }),

          // Déroulement / Activités
          new Paragraph({
            text: "Déroulement (Activités)",
            heading: HeadingLevel.HEADING_2,
          }),
          
          ...data.activities.flatMap((activity, index) => [
            new Paragraph({
              text: `Activité ${index + 1} : ${activity.name}`,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Durée : ", bold: true }),
                new TextRun(activity.duration),
                new TextRun({ text: " • Difficulté : ", bold: true }),
                new TextRun(activity.difficulty || "Moyenne"),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: activity.description })],
              spacing: { after: 100 }
            }),
            // Organization Table for Activity
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
              },
              rows: [
                  new TableRow({
                      children: [
                          new TableCell({
                             children: [new Paragraph({ children: [new TextRun({ text: "Organisation", bold: true })] })],
                             width: { size: 20, type: WidthType.PERCENTAGE },
                             shading: { fill: "F8FAFC" }
                          }),
                          new TableCell({
                             children: [new Paragraph(activity.organization || "Voir description")],
                          })
                      ]
                  }),
                  ...(activity.variations ? [
                      new TableRow({
                          children: [
                              new TableCell({
                                 children: [new Paragraph({ children: [new TextRun({ text: "Variantes", bold: true })] })],
                                 width: { size: 20, type: WidthType.PERCENTAGE },
                                 shading: { fill: "F8FAFC" }
                              }),
                              new TableCell({
                                 children: [new Paragraph(activity.variations)],
                              })
                          ]
                      })
                  ] : [])
              ]
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }), // Spacer
          ]),

          // Evaluation
           new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ text: "Critères d'évaluation", heading: HeadingLevel.HEADING_2 }),
                                ...createBulletList(data.evaluation)
                            ],
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                        }),
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({ text: "Indicateurs observables", heading: HeadingLevel.HEADING_2 }),
                                ...createBulletList(data.indicators)
                            ],
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                        }),
                    ],
                }),
            ],
          }),

          // Différenciation & Notes
          new Paragraph({
            text: "Différenciation",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.differentiation || "Adapter les distances et le temps selon le niveau.",
          }),

          new Paragraph({
            text: "Notes pour l'enseignant",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.notes,
            style: "Normal"
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const cleanSport = data.sport.replace(/\s+/g, '_');
  const cleanGrade = data.grade.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  
  FileSaver.saveAs(blob, `Fiche_EPS_${cleanSport}_${cleanGrade}_${dateStr}.docx`);
};