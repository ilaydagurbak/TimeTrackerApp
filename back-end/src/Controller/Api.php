<?php
// src/Controller/Api.php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Datetime;

use App\Entity\Trackedtime;

class Api extends Controller
{

    /**
     * @Route("/api/insertNewDuration")
     * @Method({"GET"})
     */
    public function insertNewDuration(Request $request) {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        try
        {   
            $newDuration = new Trackedtime();
            $newDuration->setDuration($request->query->get('duration')) ;
            
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($newDuration);
            $entityManager->flush();

            $response->setContent($newDuration->getId());
        }
        catch(Exception $e)
        {
            $response->setContent("0");
        }
        return $response;
    }

    /**
     * @Route("/api/updateDuration")
     * @Method({"GET"})
     */
    public function updateDuration(Request $request) {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        try
        {   
            $entityManager = $this->getDoctrine()->getManager();

            $trackedDurationId = $request->query->get('id') ;
            $duration = $request->query->get('duration') ;
            $description = $request->query->get('description') ;
            $submitdone = $request->query->get('submitdone') ;

            $submitdate = null ;

            $trackedDuration = $entityManager->getRepository(Trackedtime::class)->find($trackedDurationId);
            if (!$trackedDuration) {
                //The required id is not founded
                $response->setContent("0");
                return $response;
            }

            $trackedDuration->setDuration($duration);
            if($description!=null)
            {
                $trackedDuration->setDescription($description);
            }
            
            if($submitdone != "" && $submitdone != "0")
            {
                $submitdate = new DateTime();
                $trackedDuration->setSubmitdate($submitdate);
                $trackedDuration->setSubmitdone(1);
            }
            else{
                $trackedDuration->setSubmitdate(null);
                $trackedDuration->setSubmitdone(0);
            }

        
            
            $entityManager->flush();
            
            $response->setContent($trackedDuration->getId()); 
            return $response;
        }
        catch(Exception $e)
        {
            $response->setContent("0");
        }
        return $response;
    }

    /**
     * @Route("/api/getLastOpenedDuration")
     * @Method({"GET"})
     */
    public function getLastOpenedDuration()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $trackedTime = $this->getDoctrine()
            ->getRepository(Trackedtime::class)
            ->findBy(['submitdone' => '0']);

        if (!$trackedTime) {
            $response->setContent('null');
            return $response;
        }
        $response->setContent(json_encode($trackedTime[0]));
        return $response;
    }


    /**
     * @Route("/api/getLastDurations")
     * @Method({"GET"})
     */
    public function getLastDurations()
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $trackedTime = $this->getDoctrine()
            ->getRepository(Trackedtime::class)
            ->findBy(['submitdone' => '1']);

        if (!$trackedTime) {
            $response->setContent('[]');
            return $response;
        }
        $response->setContent(json_encode($trackedTime));
        return $response;
    }


}