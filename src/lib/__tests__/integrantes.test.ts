// src/lib/__tests__/integrantes.test.ts

// Mock the entire firebase/firestore module
jest.mock('firebase/firestore', () => {
  // Get actual classes needed for inheritance BEFORE defining the mock object
  const actualFirestore = jest.requireActual('firebase/firestore');
  const ActualDocumentSnapshot = actualFirestore.DocumentSnapshot;

  const mockFirestore = {}; // Simple mock for firestore instance

  return {
    collection: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    doc: jest.fn(),
    serverTimestamps: () => ({}),
    // More detailed mocks for classes/objects if necessary for deeper type compatibility
    // Example: Mocking a Query object structure
    Query: class MockQuery {
        converter = null; // Mock converter property
        type = 'collection'; // Mock type property
        firestore = mockFirestore; // Reference to the mock firestore
        withConverter = jest.fn(); // Mock withConverter method

        constructor(firestore: any, path: string, ...queryConstraints: any[]) {
            // Basic constructor mock
        }
        // Add other Query methods used by your code if needed
    },
    // Mocking DocumentReference structure
     DocumentReference: class MockDocumentReference<T extends DocumentData> {
        id: string;
        firestore = mockFirestore; // Reference to the mock firestore
        converter = null; // Mock converter
        type = 'document'; // Mock type

        constructor(id: string) {
            this.id = id;
        }
        // Add other DocumentReference methods used by your code if needed (e.g., get, set, update, delete)
     },
     // Mocking DocumentSnapshot structure (QueryDocumentSnapshot extends this)
      DocumentSnapshot: class MockDocumentSnapshot<T extends DocumentData> {
          id: string;
          ref: DocumentReference<T>;
          metadata: SnapshotMetadata;
          data: () => T | undefined; // data() can return undefined for DocumentSnapshot
          get = jest.fn(); // Mock the get method

          // Correctly declare exists as a boolean property
          exists: boolean; // Declare exists as a boolean

          constructor(id: string, data: T | undefined, ref: DocumentReference<T>, metadata: SnapshotMetadata) {
              this.id = id;
              this.data = () => data;
              this.ref = ref;
              this.metadata = metadata;
              // Set exists based on whether data is provided
              this.exists = data !== undefined; // Initialize exists in the constructor
              // Implement a basic get mock
              this.get.mockImplementation((fieldPath: string) => (data as any)?.[fieldPath]);
          }
      },
      // Mocking QueryDocumentSnapshot structure
       QueryDocumentSnapshot: class MockQueryDocumentSnapshot<T extends DocumentData> extends ActualDocumentSnapshot<T> { // Use ActualDocumentSnapshot here
           // QueryDocumentSnapshot is essentially a DocumentSnapshot that is guaranteed to exist
           // It inherits 'exists' from DocumentSnapshot, but it should always be true for QueryDocumentSnapshot
           constructor(id: string, data: T, ref: DocumentReference<T>, metadata: SnapshotMetadata) {
               super(id, data, ref, metadata);
               // Explicitly set exists to true for QueryDocumentSnapshot instances
               this.exists = true;
           }
           // Add other QueryDocumentSnapshot specific properties/methods if needed
       },
       // Mocking QuerySnapshot structure
        QuerySnapshot: class MockQuerySnapshot<T extends DocumentData> {
            docs: QueryDocumentSnapshot<T>[];
            empty: boolean;
            size: number;
            forEach: (callback: (doc: QueryDocumentSnapshot<T>) => void) => void;
            query: any; // Use 'any' or a more specific mock Query object if needed
            metadata: SnapshotMetadata;
            docChanges: any[]; // Mock docChanges

            constructor(docs: QueryDocumentSnapshot<T>[], metadata: SnapshotMetadata) {
                this.docs = docs;
                this.empty = docs.length === 0;
                this.size = docs.length;
                this.forEach = (callback) => docs.forEach(callback);
                // Create a simple mock query object with required properties
                 this.query = {
                    converter: null,
                    type: 'collection',
                    firestore: mockFirestore,
                    withConverter: jest.fn(),
                 };
                this.metadata = metadata;
                this.docChanges = []; // Initialize docChanges
            }
            // Add other QuerySnapshot methods if needed
        },
  };
});

// Mock the ../lib/firebase module
jest.mock('../firebase', () => ({
  db: {}, // Mock the db object
}));

// Import the functions to be tested
import { getMembers, addMember, updateMember, deleteMember } from '../integrantes';

// Import types from firebase/firestore for better mocking types
import type {
    CollectionReference,
    QuerySnapshot,
    QueryDocumentSnapshot,
    DocumentData,
    DocumentReference,
    SnapshotMetadata,
    DocumentSnapshot // Import DocumentSnapshot as QueryDocumentSnapshot extends it
} from 'firebase/firestore';


// Define a basic mock SnapshotMetadata object that conforms to the interface
const mockMetadata: SnapshotMetadata = {
    hasPendingWrites: false,
    fromCache: false,
    isEqual: (other: SnapshotMetadata) => true, // Basic mock isEqual function
};


// Get the mocked functions and classes within the describe block
describe('Integrantes Firestore Functions', () => {
    const mockCollection = require('firebase/firestore').collection as jest.Mock;
    const mockGetDocs = require('firebase/firestore').getDocs as jest.Mock<Promise<QuerySnapshot<DocumentData>>>;
    const mockAddDoc = require('firebase/firestore').addDoc as jest.Mock<Promise<DocumentReference<DocumentData>>>;
    const mockUpdateDoc = require('firebase/firestore').updateDoc as jest.Mock<Promise<void>>;
    const mockDeleteDoc = require('firebase/firestore').deleteDoc as jest.Mock<Promise<void>>;
    const mockQuery = require('firebase/firestore').query as jest.Mock;
    const mockOrderBy = require('firebase/firestore').orderBy as jest.Mock;
    const mockDoc = require('firebase/firestore').doc as jest.Mock;

    // Get mocked classes
    const MockQueryDocumentSnapshot = require('firebase/firestore').QueryDocumentSnapshot;
    const MockQuerySnapshot = require('firebase/firestore').QuerySnapshot;
    const MockDocumentReference = require('firebase/firestore').DocumentReference;


  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMembers', () => {
    it('should fetch members ordered by name', async () => {
      // Mock data returned by getDocs
      const mockMembersData = [
        { id: '1', name: 'Alice', instituicao: 'UFRRJ', areaPesquisa: 'Filosofia Antiga', curriculoLattes: 'link1' },
        { id: '2', name: 'Bob', instituicao: 'USP', areaPesquisa: 'Ética', curriculoLattes: 'link2' },
      ];

      // Create mock document snapshots using the mocked class
      const mockDocumentSnapshots = mockMembersData.map(member => {
           // Create a mock DocumentReference for the snapshot
           const mockDocRef = new MockDocumentReference(member.id);
           // Use the mocked QueryDocumentSnapshot class, passing data and ensuring exists is true
           return new MockQueryDocumentSnapshot(member.id, member, mockDocRef, mockMetadata);
      });


      // Create a mock snapshot using the mocked class
       const mockSnapshot = new MockQuerySnapshot(mockDocumentSnapshots, mockMetadata);


       // Linha 63 (aproximadamente)
      mockGetDocs.mockResolvedValue(mockSnapshot);


      // Mock the chain of collection, query, orderBy
      const mockCollectionRef = {} as CollectionReference<DocumentData>; // Mock a collection reference
      const mockQueryRef = {}; // Mock a query reference result

      mockCollection.mockReturnValue(mockCollectionRef);
      mockOrderBy.mockReturnValue(mockQueryRef);
      mockQuery.mockReturnValue(mockQueryRef); // Ensure query returns the result of orderBy

      const members = await getMembers();

      // Expect collection and query/orderBy to be called correctly
      expect(mockCollection).toHaveBeenCalledWith({}, 'integrantes');
      expect(mockOrderBy).toHaveBeenCalledWith('name', 'asc');
      // Ensure query is called with the correct arguments - the collection ref and the result of orderBy
      expect(mockQuery).toHaveBeenCalledWith(mockCollectionRef, mockQueryRef);
      expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef); // Expect getDocs to be called with the result of query


      // Expect the function to return the correct format
      // The getMembers function maps snapshots to data, so expect the original data
      expect(members).toEqual(mockMembersData);
    });

     it('should return an empty array if no members are found', async () => {
         // Create an empty mock snapshot using the mocked class
         const mockSnapshot = new MockQuerySnapshot([], mockMetadata);

         mockGetDocs.mockResolvedValue(mockSnapshot);

         const mockCollectionRef = {} as CollectionReference<DocumentData>;
         const mockQueryRef = {};
         mockCollection.mockReturnValue(mockCollectionRef);
         mockOrderBy.mockReturnValue(mockQueryRef);
         mockQuery.mockReturnValue(mockQueryRef);


         const members = await getMembers();

         expect(mockCollection).toHaveBeenCalledWith({}, 'integrantes');
         expect(mockOrderBy).toHaveBeenCalledWith('name', 'asc');
         expect(mockQuery).toHaveBeenCalledWith(mockCollectionRef, mockQueryRef);
         expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);

         expect(members).toEqual([]);
     });


     it('should handle errors during fetch', async () => {
        const fetchError = new Error('Failed to fetch members');
        mockGetDocs.mockRejectedValue(fetchError);

         const mockCollectionRef = {} as CollectionReference<DocumentData>;
         const mockQueryRef = {};
         mockCollection.mockReturnValue(mockCollectionRef);
         mockOrderBy.mockReturnValue(mockQueryRef);
         mockQuery.mockReturnValue(mockQueryRef);

        await expect(getMembers()).rejects.toThrow('Failed to fetch members');

         expect(mockCollection).toHaveBeenCalledWith({}, 'integrantes');
         expect(mockOrderBy).toHaveBeenCalledWith('name', 'asc');
         expect(mockQuery).toHaveBeenCalledWith(mockCollectionRef, mockQueryRef);
         expect(mockGetDocs).toHaveBeenCalledWith(mockQueryRef);
     });

  });

  describe('addMember', () => {
    it('should add a new member and return its ID', async () => {
      const newMemberData = {
        name: 'Charlie',
        instituicao: 'UFRJ',
        areaPesquisa: 'Metafísica',
        curriculoLattes: 'link3',
        imageUrl: 'image3.jpg'
      };
      const mockNewDocRef = { id: 'new-member-id' } as DocumentReference<DocumentData>;

      mockAddDoc.mockResolvedValue(mockNewDocRef);

      const mockCollectionRef = {} as CollectionReference<DocumentData>;
      mockCollection.mockReturnValue(mockCollectionRef);


      const memberId = await addMember(newMemberData);

      expect(mockCollection).toHaveBeenCalledWith({}, 'integrantes');
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, newMemberData);
      expect(memberId).toBe('new-member-id');
    });

     it('should handle errors during add', async () => {
        const addError = new Error('Failed to add member');
        mockAddDoc.mockRejectedValue(addError);

        const mockCollectionRef = {} as CollectionReference<DocumentData>;
        mockCollection.mockReturnValue(mockCollectionRef);


        const newMemberData = {
            name: 'Charlie',
            instituicao: 'UFRJ',
            areaPesquisa: 'Metafísica',
            curriculoLattes: 'link3',
            imageUrl: 'image3.jpg'
        };

        await expect(addMember(newMemberData)).rejects.toThrow('Failed to add member');

        expect(mockCollection).toHaveBeenCalledWith({}, 'integrantes');
        expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, newMemberData);
     });

  });

  describe('updateMember', () => {
    it('should update an existing member', async () => {
      const memberId = 'existing-id';
      const updatedData = { areaPesquisa: 'Lógica' };

      // Mock doc to return a document reference using the mocked class
      const mockDocRef = new MockDocumentReference(memberId);
      mockDoc.mockReturnValue(mockDocRef);

      mockUpdateDoc.mockResolvedValue(undefined); // updateDoc resolves with void

      await updateMember(memberId, updatedData);

      expect(mockDoc).toHaveBeenCalledWith({}, 'integrantes', memberId); // Expect doc to be called
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, updatedData);
    });

     it('should handle errors during update', async () => {
        const updateError = new Error('Failed to update member');
        mockUpdateDoc.mockRejectedValue(updateError);

        const memberId = 'existing-id';
        const updatedData = { areaPesquisa: 'Lógica' };

         const mockDocRef = new MockDocumentReference(memberId);
         mockDoc.mockReturnValue(mockDocRef);


        await expect(updateMember(memberId, updatedData)).rejects.toThrow('Failed to update member');

        expect(mockDoc).toHaveBeenCalledWith({}, 'integrantes', memberId);
        expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, updatedData);
     });

  });

  describe('deleteMember', () => {
    it('should delete an existing member', async () => {
      const memberId = 'existing-id-to-delete';

       // Mock doc to return a document reference using the mocked class
       const mockDocRef = new MockDocumentReference(memberId);
       mockDoc.mockReturnValue(mockDocRef);

      mockDeleteDoc.mockResolvedValue(undefined); // deleteDoc resolves with void

      await deleteMember(memberId);

      expect(mockDoc).toHaveBeenCalledWith({}, 'integrantes', memberId); // Expect doc to be called
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

     it('should handle errors during delete', async () => {
        const deleteError = new Error('Failed to delete member');
        mockDeleteDoc.mockRejectedValue(deleteError);

        const memberId = 'existing-id-to-delete';

        const mockDocRef = new MockDocumentReference(memberId);
        mockDoc.mockReturnValue(mockDocRef);

        await expect(deleteMember(memberId)).rejects.toThrow('Failed to delete member');

        expect(mockDoc).toHaveBeenCalledWith({}, 'integrantes', memberId);
        expect(mockDeleteDoc).toHaveBeenCalledWith(mockDocRef);
     });
  });
});
