import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Image, ListGroup, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const TrainingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [training, setTraining] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'All Levels',
    format: 'Physical/Online Class',
    careerProspect: 'Industry Professional',
    price: 0,
    discount: 0,
    featured: false,
    order: 0,
    learningTopics: [],
    instructor: {
      name: '',
      title: '',
      bio: '',
      imageUrl: ''
    }
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [instructorImage, setInstructorImage] = useState(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      const fetchTraining = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/api/trainings/${id}`);
          setTraining({
            ...data,
            learningTopics: data.learningTopics || [],
            instructor: data.instructor || {
              name: '',
              title: '',
              bio: '',
              imageUrl: ''
            }
          });
          
          // Set image preview if available
          if (data.imageUrl && data.imageUrl !== 'default-training.jpg') {
            setImagePreview(`${API_URL}/uploads/${data.imageUrl}`);
          }
          
          // Set instructor image preview if available
          if (data.instructor && data.instructor.imageUrl && data.instructor.imageUrl !== 'default-instructor.jpg') {
            setInstructorImagePreview(`${API_URL}/uploads/${data.instructor.imageUrl}`);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch training details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchTraining();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTraining({
      ...training,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setTraining({
      ...training,
      instructor: {
        ...training.instructor,
        [name]: value
      }
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleInstructorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstructorImage(file);
      setInstructorImagePreview(URL.createObjectURL(file));
    }
  };

  const addLearningTopic = () => {
    if (newTopic.trim()) {
      setTraining({
        ...training,
        learningTopics: [...training.learningTopics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeLearningTopic = (index) => {
    const updatedTopics = [...training.learningTopics];
    updatedTopics.splice(index, 1);
    setTraining({
      ...training,
      learningTopics: updatedTopics
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setLoading(true);
    
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      
      // Add training data to form
      Object.keys(training).forEach(key => {
        if (key === 'learningTopics') {
          // Handle array data for FormData
          training.learningTopics.forEach((topic, index) => {
            formData.append(`learningTopics[${index}]`, topic);
          });
        } else if (key === 'instructor') {
          // Handle instructor object
          Object.keys(training.instructor).forEach(instructorKey => {
            if (instructorKey !== 'imageUrl') {
              formData.append(`instructor[${instructorKey}]`, training.instructor[instructorKey]);
            }
          });
        } else {
          formData.append(key, training[key]);
        }
      });
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }
      
      // Add instructor image if selected
      if (instructorImage) {
        formData.append('instructorImage', instructorImage);
      }
      
      if (isEditMode) {
        await axios.put(`${API_URL}/api/trainings/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_URL}/api/trainings`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      navigate('/trainings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save training');
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <Container>
      <h2 className="mb-4">{isEditMode ? 'Edit Training' : 'Add New Training'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter training title"
                value={training.title}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                placeholder="Enter training description"
                value={training.description}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="learningTopics">
              <Form.Label>What You Can Learn</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter a learning topic"
                />
                <Button 
                  variant="outline-primary" 
                  onClick={addLearningTopic}
                  disabled={!newTopic.trim()}
                >
                  Add Topic
                </Button>
              </InputGroup>
              <ListGroup>
                {training.learningTopics.length > 0 ? (
                  training.learningTopics.map((topic, index) => (
                    <ListGroup.Item 
                      key={index} 
                      className="d-flex justify-content-between align-items-center"
                    >
                      {topic}
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeLearningTopic(index)}
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-muted">No learning topics added yet. Add topics that describe what students will learn from this training.</p>
                )}
              </ListGroup>
            </Form.Group>
            
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Instructor Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="instructorName">
                      <Form.Label>Instructor Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter instructor name"
                        value={training.instructor.name}
                        onChange={handleInstructorChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="instructorTitle">
                      <Form.Label>Instructor Title/Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="e.g. Senior Web Developer"
                        value={training.instructor.title}
                        onChange={handleInstructorChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="instructorBio">
                  <Form.Label>Instructor Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    rows={3}
                    placeholder="Brief description about the instructor"
                    value={training.instructor.bio}
                    onChange={handleInstructorChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="instructorImage">
                  <Form.Label>Instructor Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleInstructorImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload an image of the instructor (recommended size: 200x200px)
                  </Form.Text>
                </Form.Group>
                
                {instructorImagePreview && (
                  <div className="mb-3">
                    <p>Instructor Image Preview:</p>
                    <Image 
                      src={instructorImagePreview} 
                      alt="Instructor preview" 
                      style={{ maxWidth: '150px', maxHeight: '150px' }} 
                      roundedCircle
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    placeholder="e.g. 2.5 months, 3 months"
                    value={training.duration}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a duration.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="level">
                  <Form.Label>Training Level</Form.Label>
                  <Form.Select
                    name="level"
                    value={training.level}
                    onChange={handleChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="format">
                  <Form.Label>Format</Form.Label>
                  <Form.Select
                    name="format"
                    value={training.format}
                    onChange={handleChange}
                  >
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                    <option value="Physical/Online Class">Physical/Online Class</option>
                    <option value="Hybrid">Hybrid</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="careerProspect">
                  <Form.Label>Career Prospect</Form.Label>
                  <Form.Control
                    type="text"
                    name="careerProspect"
                    placeholder="e.g. Barista/Coffee Professional"
                    value={training.careerProspect}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="image">
                  <Form.Label>Training Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload an image for this training (recommended size: 300x200px)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            {imagePreview && (
              <div className="mb-3">
                <p>Training Image Preview:</p>
                <Image 
                  src={imagePreview} 
                  alt="Training preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px' }} 
                  thumbnail 
                />
              </div>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    value={training.price}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid price.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="discount">
                  <Form.Label>Discount (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    min="0"
                    step="1"
                    value={training.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="order">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="order"
                value={training.order}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="featured">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Training"
                checked={training.featured}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Training'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/trainings')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TrainingForm; 