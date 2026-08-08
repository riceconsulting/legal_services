import React, { useState, useMemo } from 'react';
import type { Document } from '../types';
import FileUpload from './FileUpload';
import ConfirmationModal from './ConfirmationModal';
import { DocumentIcon } from './icons/DocumentIcon';
import { SearchIcon } from './icons/SearchIcon';
import { GavelIcon } from './icons/GavelIcon';
import { ScrollIcon } from './icons/ScrollIcon';
import { StampIcon } from './icons/StampIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import Tooltip from './Tooltip';
import { translations } from '../lib/translations';
import SampleOutput from './SampleOutput';

interface DashboardProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onFileUpload: (file: File) => void;
  onDeleteDocument: (documentId: string) => void;
  isUploading: boolean;
  language: 'en' | 'id';
}

const TypeIcon: React.FC<{ type: string; className: string }> = ({ type, className }) => {
  const lowercasedType = type.toLowerCase();

  switch (true) {
    case lowercasedType.includes('putusan'):
      return <GavelIcon className={className} />;
    case lowercasedType.includes('akta'):
    case lowercasedType.includes('kuasa'):
      return <StampIcon className={className} />;
    case lowercasedType.includes('perjanjian'):
      return <ScrollIcon className={className} />;
    default:
      return <DocumentIcon className={className} />;
  }
};


const Dashboard: React.FC<DashboardProps> = ({ documents, onSelectDocument, onFileUpload, onDeleteDocument, isUploading, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  const t = translations[language];

  const filteredDocuments = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return documents;
    }
    const lowercasedQuery = trimmedQuery.toLowerCase();
    return documents.filter(doc => {
      const inName = doc.name.toLowerCase().includes(lowercasedQuery);
      const inType = doc.type.toLowerCase().includes(lowercasedQuery);
      const inContent = doc.content.toLowerCase().includes(lowercasedQuery);
      return inName || inType || inContent;
    });
  }, [documents, searchQuery]);

  const handleConfirmDelete = () => {
    if (docToDelete) {
      onDeleteDocument(docToDelete.id);
      setDocToDelete(null);
    }
  };
  
  const DocumentRow: React.FC<ListChildComponentProps> = ({ index, style }) => {
      const doc = filteredDocuments[index];

      return (
          <div style={style}>
              <div 
                  onClick={() => onSelectDocument(doc)} 
                  className="group cursor-pointer hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors duration-200 w-full h-full flex items-center border-b border-border-light dark:border-border-dark"
                  role="button"
                  tabIndex={0}
              >
                  <div className="flex items-center px-4 py-4 sm:px-6 w-full">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <Tooltip text={doc.type} position="right">
                          <TypeIcon type={doc.type} className="h-8 w-8 text-text-secondary dark:text-text-secondary-dark group-hover:text-accent-teal dark:group-hover:text-accent-sky transition-colors" />
                        </Tooltip>
                      </div>
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                           <div className="flex items-center">
                            <p className="truncate font-medium text-text-primary dark:text-text-primary-dark">{doc.name}</p>
                          </div>
                          <p className="mt-1 flex items-center text-sm text-text-secondary dark:text-text-secondary-dark">
                            {doc.type}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                            {t.lastModified}:{' '}
                            <time dateTime={doc.date}>{doc.date}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                     <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                        <Tooltip text={t.deleteTooltip(doc.name)} position="left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocToDelete(doc);
                            }}
                            className="p-2 rounded-full text-text-secondary dark:text-text-secondary-dark hover:bg-error-light dark:hover:bg-error-dark/20 hover:text-error-light dark:hover:text-error-dark opacity-0 group-hover:opacity-100 transition-all"
                            aria-label={`Delete ${doc.name}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <div className="transform transition-transform group-hover:translate-x-1">
                          <svg className="h-5 w-5 text-accent-sky dark:text-text-secondary-dark" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary dark:text-text-primary-dark">{t.dashboardTitle}</h1>
        <p className="text-text-secondary dark:text-text-secondary-dark mt-1">{t.dashboardSubtitle}</p>
      </div>
      
      <FileUpload onFileUpload={onFileUpload} isProcessing={isUploading} language={language} />

      {documents.length > 0 ? (
        <div>
            <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">{t.recentProjects}</h2>
            <div className="relative mb-4 group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-text-secondary dark:text-text-secondary-dark" aria-hidden="true" />
            </div>
            <input
                type="search"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 bg-background-main dark:bg-surface-dark py-2.5 pl-10 pr-3 text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark transition-shadow focus:ring-2 focus:ring-inset focus:ring-accent-teal dark:focus:ring-accent-sky sm:text-sm sm:leading-6"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
            <div className="bg-background-main dark:bg-surface-dark rounded-lg shadow-md overflow-hidden h-[600px]">
            {filteredDocuments.length > 0 ? (
                <List
                    height={600}
                    itemCount={filteredDocuments.length}
                    itemSize={88}
                    width="100%"
                >
                    {DocumentRow}
                </List>
            ) : (
                <div className="h-full flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
                <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    {t.noDocumentsFound}
                </h3>
                <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-sm">
                    {t.noDocumentsFoundDesc(searchQuery)}
                </p>
                </div>
            )}
            </div>
        </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in gap-6">
                <div className="text-center">
                    <DocumentIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-primary-dark">
                        {t.workspaceReady}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark max-w-sm mx-auto">
                       {t.workspaceReadyDesc}
                    </p>
                </div>
                <SampleOutput
                    title="Sample Output: PT Maju Jaya Sejahtera vs CV Berkah Abadi Makmur"
                    description="6 analysis sections for this court decision (Case No: 123/Pdt.G/2024/PA.Sby)."
                >
                    <div className="space-y-4">
                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">1. Document Summary</span>
                            </div>
                            <p className="text-xs text-text-primary-light dark:text-text-primary-dark">Putusan perkara perdata antara PT Maju Jaya Sejahtera (Penggugat) melawan CV Berkah Abadi Makmur (Tergugat) mengenai wanprestasi dalam pengadaan komponen elektronik senilai Rp 2.3 miliar.</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Jenis:</span> Putusan Pengadilan</div>
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Pengadilan:</span> Pengadilan Negeri Surabaya</div>
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Nomor:</span> 123/Pdt.G/2024/PA.Sby</div>
                                <div><span className="text-text-secondary-light dark:text-text-secondary-dark">Tanggal:</span> 25 Juni 2024</div>
                            </div>
                        </div>

                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded">2. Legal Risk Analysis</span>
                            </div>
                            <ul className="text-xs text-text-primary-light dark:text-text-primary-dark space-y-2">
                                <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded"><span className="font-medium">Wanprestasi:</span> Tergugat tidak mengirimkan barang sesuai spesifikasi yang disepakati dalam kontrak.</li>
                                <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded"><span className="font-medium">Ganti Rugi:</span> Tergugat dapat dimintakan ganti rugi materiil sebesar Rp 2.3 miliar.</li>
                                <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded"><span className="font-medium">Jaminan Pelaksanaan:</span> Bond performance bank penggugat dapat terdampak.</li>
                            </ul>
                        </div>

                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">3. Key Clauses Extracted</span>
                            </div>
                            <div className="space-y-2 text-xs text-text-primary-light dark:text-text-primary-dark">
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded"><span className="font-medium">Pasal 4:</span> Kewajiban Tergugat untuk mengirimkan barang sesuai spesifikasi dalam jangka waktu 30 hari.</div>
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded"><span className="font-medium">Pasal 7:</span> Denda keterlambatan sebesar 0.5% per hari dari nilai kontrak.</div>
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded"><span className="font-medium">Pasal 12:</span> Penyelesaian sengketa melalui pengadilan negeri yang berwenang.</div>
                            </div>
                        </div>

                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded">4. Financial Impact Assessment</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded">
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Nilai Kontrak</p>
                                    <p className="font-medium">Rp 2.300.000.000</p>
                                </div>
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded">
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Potensi Ganti Rugi</p>
                                    <p className="font-medium text-red-600 dark:text-red-400">Rp 2.300.000.000</p>
                                </div>
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded">
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Denda Keterlambatan</p>
                                    <p className="font-medium">Rp 115.000.000/hari</p>
                                </div>
                                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded">
                                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Biaya Pengacara</p>
                                    <p className="font-medium">Rp 50.000.000 - 100.000.000</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">5. Recommended Actions</span>
                            </div>
                            <ul className="text-xs text-text-primary-light dark:text-text-primary-dark space-y-2">
                                <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">✓</span> <span><span className="font-medium">Segera:</span> Tinjau ketentuan kontrak dan jadwal pengiriman.</span></li>
                                <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">✓</span> <span><span className="font-medium">Dokumentasi:</span> Kumpulkan semua korespondensi dan catatan pengiriman.</span></li>
                                <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">✓</span> <span><span className="font-medium">Mediasi:</span> Pertimbangkan penyelesaian di luar pengadilan.</span></li>
                                <li className="flex items-start gap-2"><span className="text-green-600 dark:text-green-400 mt-0.5">✓</span> <span><span className="font-medium">Konsultasi:</span> Hubungi pengacara untuk penilaian lebih lanjut.</span></li>
                            </ul>
                        </div>

                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 text-xs font-medium rounded">6. Timeline & Deadlines</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark">30 hari sebelumnya:</span>
                                    <span className="text-text-primary-light dark:text-text-primary-dark">Pengiriman seharusnya dilakukan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Hari ini:</span>
                                    <span className="text-text-primary-light dark:text-text-primary-dark">Sidang putusan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark">14 hari ke depan:</span>
                                    <span className="text-text-primary-light dark:text-text-primary-dark">Batas banding</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span className="text-text-secondary-light dark:text-text-secondary-dark">30 hari ke depan:</span>
                                    <span className="text-text-primary-light dark:text-text-primary-dark">Eksekusi putusan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SampleOutput>
            </div>
        )}

       <ConfirmationModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t.confirmDeletionTitle}
        language={language}
      >
        <p dangerouslySetInnerHTML={{ __html: t.confirmDeletionDesc(docToDelete?.name) }} />
      </ConfirmationModal>
    </div>
  );
};

export default Dashboard;
