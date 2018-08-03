<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Trackedtime
 *
 * @ORM\Table(name="trackedtime")
 * @ORM\Entity
 */
class Trackedtime
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    public $id;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=250, nullable=false)
     */
    public $description = '';

    /**
     * @var int
     *
     * @ORM\Column(name="duration", type="bigint", nullable=false)
     */
    public $duration = '0';

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="submitdate", type="date", nullable=true)
     */
    public $submitdate;

    /**
     * @var bool
     *
     * @ORM\Column(name="submitdone", type="boolean", nullable=false)
     */
    public $submitdone = '0';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getSubmitdate(): ?\DateTimeInterface
    {
        return $this->submitdate;
    }

    public function setSubmitdate(?\DateTimeInterface $submitdate): self
    {
        $this->submitdate = $submitdate;

        return $this;
    }

    public function getSubmitdone(): ?bool
    {
        return $this->submitdone;
    }

    public function setSubmitdone(bool $submitdone): self
    {
        $this->submitdone = $submitdone;

        return $this;
    }


}
